// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario } from './Scenario';
import { Microservice } from 'Microservice';

export class FlightPlan {
    private microservices: Microservice[];
    private scenarios: Scenario[];
    readonly outputPath: string;

    constructor(outputPath: string, microservices: Microservice[], scenarios: Scenario[]) {
        this.outputPath = outputPath;
        this.microservices = microservices;
        this.scenarios = scenarios;
    }
}
