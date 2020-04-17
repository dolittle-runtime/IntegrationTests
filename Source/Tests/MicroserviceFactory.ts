// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as fs from 'fs';
import * as path from 'path';

import { Microservice } from './Microservice';
import { IContainerFactory } from './IContainerFactory';
import { IMicroserviceFactory } from './IMicroserviceFactory';
import { Guid } from '@dolittle/rudiments';
import * as Handlebars from 'handlebars';

const HeadConfig = 'HeadConfig';
const RuntimeConfig = 'RuntimeConfig';

export class MicroserviceFactory implements IMicroserviceFactory {

    constructor(private _containerFactory: IContainerFactory) {
    }

    async create(name: string, workingDirectory: string, tenants: Guid[], target: string): Promise<Microservice> {
        const eventStoreStorage = this._containerFactory.create({
            image: 'dolittle/mongodb',
            exposedPorts: [27017]
        });
        await eventStoreStorage.configure();

        const head = this._containerFactory.create({
            image: `dolittle/integrationtests-head-${target}`,
            exposedPorts: [5000],
            mounts: [
                {
                    host: this.getHostPathFor(HeadConfig, 'resources.json', workingDirectory),
                    container: '/app/.dolittle/resources.json'
                },
                {
                    host: this.getHostPathFor(HeadConfig, 'tenants.json', workingDirectory),
                    container: '/app/.dolittle/tenants.json'
                },
                {
                    host: this.getHostPathFor(HeadConfig, 'clients.json', workingDirectory),
                    container: '/app/.dolittle/clients.json'
                }
            ]
        });
        await head.configure();

        const runtime = this._containerFactory.create({
            image: 'dolittle/runtime',
            tag: '5.0.0-alpha.15',
            exposedPorts: [81, 9700, 50052, 50053],
            mounts: [
                {
                    host: this.getHostPathFor(RuntimeConfig, 'resources.json', workingDirectory),
                    container: '/app/.dolittle/resources.json'
                }
            ]
        });
        await runtime.configure();

        const context = {
            tenants: tenants.map(tenant => {
                return {
                    tenantId: tenant,
                    server: `localhost:${eventStoreStorage.boundPorts.get(27017)}`
                };
            }),
            publicPort: runtime.boundPorts.get(50052),
            privatePort: runtime.boundPorts.get(50053)
        };

        this.generateConfigurationForRuntime(workingDirectory, context);
        this.generateConfigurationForHead(workingDirectory, context);

        const microservice = new Microservice(name, head, runtime, eventStoreStorage);
        return microservice;
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
}
