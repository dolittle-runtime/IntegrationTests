// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Microservice } from './Microservice';
import { IMicroserviceFactory } from './IMicroserviceFactory';
import { Guid } from '@dolittle/rudiments';
import { IFlightPaths } from './IFlightPaths';

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

    constructor(name: string, private _platform: string, private _paths: IFlightPaths, private _microserviceFactory?: IMicroserviceFactory) {
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
            const workingDirectory = this._paths.forScenarioContext(this);
            const microservice = await this._microserviceFactory?.create(ms.name, workingDirectory, ms.tenants, this._platform);
            if (microservice) {
                this.microservices.set(ms.name, microservice);
            }
        }
    }
}
