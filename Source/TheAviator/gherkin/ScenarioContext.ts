// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioEnvironmentDefinition } from './ScenarioEnvironmentDefinition';
import { ScenarioEnvironment } from './ScenarioEnvironment';
import { MicroserviceInContext } from './MicroserviceInContext';

export abstract class ScenarioContext {
    environment: ScenarioEnvironment = ScenarioEnvironment.empty;
    microservices: { [key: string]: MicroserviceInContext } = {};

    abstract async describe(environment: ScenarioEnvironmentDefinition): Promise<void>;

    async establish(environment: ScenarioEnvironment): Promise<void> {
        this.environment = environment;
        const keys = Object.keys(environment.microservices);
        for (const microservice of keys) {
            this.microservices[microservice] = new MicroserviceInContext(environment.microservices[microservice]);
        }
    }
}
