// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Microservice } from './Microservice';
import { IContainerFactory } from './IContainerFactory';
import { IMicroserviceFactory } from './IMicroserviceFactory';

export class MicroserviceFactory implements IMicroserviceFactory {

    constructor(private _containerFactory: IContainerFactory) {
    }

    create(name: string, target: string = 'dotnet'): Microservice {
        const eventStoreStorage = this._containerFactory.create({
            image: 'dolittle/mongodb',
            exposedPorts: [27017]
        });
        const head = this._containerFactory.create({
            image: `dolittle/integrationtests-head-${target}`,
            exposedPorts: [5000]
        });
        const runtime = this._containerFactory.create({
            image: 'dolittle/runtime',
            tag: '5.0.0-alpha.15',
            exposedPorts: [81, 9700, 50052, 50053]
        });
        const microservice = new Microservice(name, head, runtime, eventStoreStorage);
        return microservice;
    }
}
