// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Microservice } from './Microservice';
import { IMicroserviceFactory } from './IMicroserviceFactory';
import { Guid } from '@dolittle/rudiments';

class MicroserviceForPreparation {
    readonly name: string;
    readonly tenants: Guid[];

    constructor(name: string, tenants: Guid[]) {
        this.name = name;
        this.tenants = tenants;
    }
}

export class ScenarioContext {
    private _tenants: Guid[] | undefined;
    private _microservicesToPrepare: MicroserviceForPreparation[] = [];

    readonly name: string;
    readonly microservices: Map<string, Microservice>;

    constructor(name: string, private _microserviceFactory: IMicroserviceFactory, private _workingDirectory: string, private _target: string) {
        this.name = name;
        this.microservices = new Map();
    }

    withTenants(tenants: Guid[]): ScenarioContext {
        this._tenants = tenants;
        return this;
    }

    withMicroservice(name: string, tenants: Guid[] | undefined): ScenarioContext {
        this._microservicesToPrepare.push(new MicroserviceForPreparation(name, (tenants ?? this._tenants) ?? []));
        return this;
    }

    async prepare() {
        for (const ms of this._microservicesToPrepare) {
            const microservice = await this._microserviceFactory.create(ms.name, this._workingDirectory, ms.tenants, this._target);
            this.microservices.set(ms.name, microservice);
        }
    }
}
