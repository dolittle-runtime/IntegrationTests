// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

import { Microservice } from './Microservice';
import { IContainerEnvironment } from '../containers/IContainerEnvironment';
import { IMicroserviceFactory } from './IMicroserviceFactory';
import { Guid } from '@dolittle/rudiments';
import { IContainer } from '../containers/IContainer';
import { ContainerOptions } from 'containers/ContainerOptions';
import { Mount } from '../containers/Mount';
import { ISerializer } from '../ISerializer';

const HeadConfig = 'HeadConfig';
const RuntimeConfig = 'RuntimeConfig';

export class MicroserviceFactory implements IMicroserviceFactory {

    constructor(private _containerEnvironment: IContainerEnvironment, private _serializer: ISerializer) {
    }

    async create(name: string, workingDirectory: string, tenants: Guid[], target: string): Promise<Microservice> {
        const microserviceIdentifier = Guid.create();
        const networkName = this.getNetworkNameFor(microserviceIdentifier, name);
        await this._containerEnvironment.createNetwork(networkName);

        const shortIdentifier = microserviceIdentifier.toString().substr(0, 8);

        const mongoHost = `mongo-${shortIdentifier}`;
        const runtimeHost = `runtime-${shortIdentifier}`;
        const headHost = `head-${shortIdentifier}`;

        const eventStoreStorage = await this.configureContainer(
            name,
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
                host: path.join(workingDirectory, name, 'data'),
                container: '/data'
            }]
        );

        const head = await this.configureContainer(
            name,
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
            name,
            workingDirectory,
            'runtime',
            runtimeHost,
            'dolittle/runtime',
            '5.0.0-alpha.15',
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

        this.generateConfigurationForRuntime(name, workingDirectory, context);
        this.generateConfigurationForHead(name, workingDirectory, context);

        const microservice = new Microservice(microserviceIdentifier, name, head, runtime, eventStoreStorage);
        return microservice;
    }

    cleanupAfter(microservice: Microservice) {
        this._containerEnvironment.removeNetwork(this.getNetworkNameFor(microservice.uniqueIdentifier, microservice.name));
    }

    async configureContainer(
        microservice: string,
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
            friendlyName: name,
            image: image,
            tag: tag,
            exposedPorts: exposedPorts,
            networkName: networkName,
            mounts: configurationFiles.map(file => {
                return {
                    host: this.getAndEnsureHostPathFor(microservice, configurationTarget, file, workingDirectory),
                    container: `/app/.dolittle/${file}`
                };
            })
        } as ContainerOptions;

        mounts?.forEach(_ => containerOptions.mounts?.push(_));

        const container = this._containerEnvironment.createContainer(containerOptions);
        await container.configure();

        return container;
    }

    private generateConfigurationForRuntime(microservice: string, workingDirectory: string, context: any) {
        this.generateFile(microservice, RuntimeConfig, 'resources.json', workingDirectory, context);
    }

    private generateConfigurationForHead(microservice: string, workingDirectory: string, context: any) {
        this.generateFile(microservice, HeadConfig, 'resources.json', workingDirectory, context);
        this.generateFile(microservice, HeadConfig, 'tenants.json', workingDirectory, context);
        this.generateFile(microservice, HeadConfig, 'clients.json', workingDirectory, context);
    }

    private generateFile(microservice: string, target: string, file: string, workingDirectory: string, context: any) {
        const source = this.getSourcePathFor(target, file);
        const content = fs.readFileSync(source, 'utf8').toString();
        const template = Handlebars.compile(content);
        const result = template(context);
        const destination = this.getAndEnsureHostPathFor(microservice, target, file, workingDirectory);
        fs.writeFileSync(destination, result);
    }

    private getSourcePathFor(target: string, file: string) {
        const sourcePath = path.join(process.cwd(), target);
        return path.join(sourcePath, file);
    }

    private getAndEnsureHostPathFor(microservice: string, target: string, file: string, workingDirectory: string) {
        const hostPath = path.join(workingDirectory, microservice, target);
        if (!fs.existsSync(hostPath)) {
            fs.mkdirSync(hostPath, { recursive: true });
        }

        return path.join(hostPath, file);
    }


    private getNetworkNameFor(microserviceIdentifier: Guid, microserviceName: string): string {
        return `${microserviceName}-${microserviceIdentifier.toString()}-network`;
    }
}
