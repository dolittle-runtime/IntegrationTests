// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { MicroserviceDefinition } from './MicroserviceDefinition';

export class ScenarioContextDefinition {
    private _tenants: Guid[] | undefined;
    private _microservicesToPrepare: MicroserviceDefinition[] = [];

    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    get microservices(): MicroserviceDefinition[] {
        return this._microservicesToPrepare.slice();
    }

    withTenants(tenants: Guid[]): ScenarioContextDefinition {
        this._tenants = tenants;
        return this;
    }

    withMicroservice(name: string, tenants: Guid[] | undefined): ScenarioContextDefinition {
        this._microservicesToPrepare.push(new MicroserviceDefinition(name, (tenants ?? this._tenants) ?? []));
        return this;
    }
}

