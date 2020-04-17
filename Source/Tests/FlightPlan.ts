// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario } from './Scenario';
import { Microservice } from 'Microservice';

import { Guid } from '@dolittle/rudiments';

export class FlightPlan {
    readonly outputPath: string;
    readonly tenants: Guid[];
    readonly microservices: Microservice[];
    readonly scenarios: Scenario[];

    constructor(outputPath: string, tenants: Guid[], microservices: Microservice[], scenarios: Scenario[]) {
        this.outputPath = outputPath;
        this.tenants = tenants;
        this.microservices = microservices;
        this.scenarios = scenarios;
    }
}
