// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as path from 'path';

import { Guid } from '@dolittle/rudiments';

import { ISerializer } from '../ISerializer';

import { ContainerOptions, IContainer, IContainerEnvironment, Mount } from '../containers';

import { Microservice } from './Microservice';
import { IMicroserviceFactory } from './IMicroserviceFactory';
import { MicroserviceConfiguration } from './configuration/MicroserviceConfiguration';
import { IConfigurationManager } from './configuration/IConfigurationManager';

export class MicroserviceFactory implements IMicroserviceFactory {

    constructor(
        private _containerEnvironment: IContainerEnvironment,
        private _configurationManager: IConfigurationManager) {
    }

    async create(platform: string, name: string, tenants: Guid[], workingDirectory: string): Promise<Microservice> {
        const identifier = Guid.create();
        const configuration = new MicroserviceConfiguration(platform, name, identifier, tenants);

        const networkName = this.getNetworkNameFor(identifier, name);
        await this._containerEnvironment.createNetwork(networkName);


        const eventStoreStorage = await this.configureContainer(
            'mongo',
            configuration.mongoHost,
            'dolittle/mongodb',
            'latest',
            [27017],
            networkName,
            [{
                host: path.join(workingDirectory, name, 'data'),
                container: '/data'
            }]
        );

        const head = await this.configureContainer(
            'head',
            configuration.head.host,
            `dolittle/integrationtests-head-${platform}`,
            'latest',
            [5000],
            networkName,
            this._configurationManager.generateForHead(configuration, workingDirectory)
        );

        const runtime = await this.configureContainer(
            'runtime',
            configuration.runtime.host,
            'dolittle/runtime',
            '5.0.0-alpha.15',
            [81, 9700, 50052, 50053],
            networkName,
            this._configurationManager.generateForRuntime(configuration, workingDirectory)
        );

        const microservice = new Microservice(configuration, head, runtime, eventStoreStorage);
        return microservice;
    }

    cleanupAfter(microservice: Microservice) {
        this._containerEnvironment.removeNetwork(this.getNetworkNameFor(Guid.parse(microservice.configuration.identifier), microservice.configuration.name));
    }

    async configureContainer(
        name: string,
        uniqueName: string,
        image: string,
        tag: string,
        exposedPorts: number[],
        networkName: string,
        mounts?: Mount[]): Promise<IContainer> {

        const containerOptions = {
            name: uniqueName,
            friendlyName: name,
            image: image,
            tag: tag,
            exposedPorts: exposedPorts,
            networkName: networkName,
            mounts: mounts
        } as ContainerOptions;

        const container = this._containerEnvironment.createContainer(containerOptions);
        await container.configure();

        return container;
    }

    private getNetworkNameFor(microserviceIdentifier: Guid, microserviceName: string): string {
        return `${microserviceName}-${microserviceIdentifier.toString()}-network`;
    }
}
