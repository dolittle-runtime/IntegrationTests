// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

import { Microservice } from './Microservice';
import { IContainerEnvironment } from './IContainerEnvironment';
import { IMicroserviceFactory } from './IMicroserviceFactory';
import { Guid } from '@dolittle/rudiments';
import { IContainer } from './IContainer';
import { ContainerOptions } from 'ContainerOptions';
import { Mount } from './Mount';

const HeadConfig = 'HeadConfig';
const RuntimeConfig = 'RuntimeConfig';

export class MicroserviceFactory implements IMicroserviceFactory {

    constructor(private _containerEnvironment: IContainerEnvironment) {
    }

    async create(name: string, workingDirectory: string, tenants: Guid[], target: string): Promise<Microservice> {
        const microserviceIdentifier = Guid.create();
        const networkName = this.getNetworkNameFor(microserviceIdentifier, name);
        await this._containerEnvironment.createNetwork(networkName);

        const shortIdentifier = microserviceIdentifier.toString().substr(0,8);

        const mongoHost = `mongo-${shortIdentifier}`;
        const runtimeHost = `runtime-${shortIdentifier}`;
        const headHost = `head-${shortIdentifier}`;

        const eventStoreStorage = await this.configureContainer(
            workingDirectory,
            'mongo',
            mongoHost,
            'dolittle/mongodb',
            'latest',
            [27017],
            networkName,
            RuntimeConfig,
            [],
            [{
                host: path.join(workingDirectory, 'data'),
                container: '/data'
            }]
        );

        const head = await this.configureContainer(
            workingDirectory,
            'head',
            headHost,
            `dolittle/integrationtests-head-${target}`,
            'latest',
            [5000],
            networkName,
            HeadConfig,
            ['resources.json', 'tenants.json', 'clients.json']
        );

        const runtime = await this.configureContainer(
            workingDirectory,
            'runtime',
            runtimeHost,
            'dolittle/runtime',
            'latest',
            [81, 9700, 50052, 50053],
            networkName,
            RuntimeConfig,
            ['resources.json']
        );

        const context = {
            tenants: tenants.map(tenant => {
                return {
                    tenantId: tenant,
                    server: mongoHost
                };
            }),
            runtimeHost: runtimeHost,
            headHost: headHost,
            publicPort: 50052,
            privatePort: 50053
        };

        this.generateConfigurationForRuntime(workingDirectory, context);
        this.generateConfigurationForHead(workingDirectory, context);

        const microservice = new Microservice(microserviceIdentifier, name, head, runtime, eventStoreStorage);
        return microservice;
    }

    cleanupAfter(microservice: Microservice) {
        this._containerEnvironment.removeNetwork(this.getNetworkNameFor(microservice.uniqueIdentifier, microservice.name));
    }

    async configureContainer(
        workingDirectory: string,
        name: string,
        uniqueName: string,
        image: string,
        tag: string,
        exposedPorts: number[],
        networkName: string,
        configurationTarget: string,
        configurationFiles: string[],
        mounts?: Mount[]): Promise<IContainer> {

        const containerOptions = {
            name: uniqueName,
            image: image,
            tag: tag,
            exposedPorts: exposedPorts,
            networkName: networkName,
            mounts: configurationFiles.map(file => {
                return {
                    host: this.getHostPathFor(configurationTarget, file, workingDirectory),
                    container: `/app/.dolittle/${file}`
                };
            })
        } as ContainerOptions;

        mounts?.forEach(_ => containerOptions.mounts?.push(_));

        const container = this._containerEnvironment.createContainer(containerOptions);
        await container.configure();

        const containerOptionsFile = path.join(workingDirectory, `${name}.json`);
        const configOutput = JSON.parse(JSON.stringify(containerOptions));

        configOutput.boundPorts = {};
        for (const [k, v] of container.boundPorts) {
            configOutput.boundPorts[k] = v;
        }
        fs.writeFileSync(containerOptionsFile, JSON.stringify(configOutput));

        return container;
    }

    private generateConfigurationForRuntime(workingDirectory: string, context: any) {
        this.generateFile(RuntimeConfig, 'resources.json', workingDirectory, context);
    }

    private generateConfigurationForHead(workingDirectory: string, context: any) {
        this.generateFile(HeadConfig, 'resources.json', workingDirectory, context);
        this.generateFile(HeadConfig, 'tenants.json', workingDirectory, context);
        this.generateFile(HeadConfig, 'clients.json', workingDirectory, context);
    }

    private generateFile(target: string, file: string, workingDirectory: string, context: any) {
        const source = this.getHostPathFor(target, file);
        const destinationDirectory = path.join(workingDirectory, target);
        const destination = path.join(destinationDirectory, file);
        const content = fs.readFileSync(source, 'utf8').toString();
        const template = Handlebars.compile(content);
        const result = template(context);

        if (!fs.existsSync(destinationDirectory)) {
            fs.mkdirSync(destinationDirectory);
        }

        fs.writeFileSync(destination, result);
    }

    private getHostPathFor(target: string, file: string, sourceDirectory?: string) {
        if (!sourceDirectory) {
            sourceDirectory = process.cwd();
        }
        return path.join(sourceDirectory, target, file);
    }

    private getNetworkNameFor(microserviceIdentifier: Guid, microserviceName: string): string {
        return `${microserviceName}-${microserviceIdentifier.toString()}-network`;
    }
}
