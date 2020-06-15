// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioEnvironmentDefinition } from './ScenarioEnvironmentDefinition';
import { ScenarioEnvironment } from './ScenarioEnvironment';
import { MicroserviceInContext } from './MicroserviceInContext';

export abstract class ScenarioContext {
    private _environment: ScenarioEnvironment = ScenarioEnvironment.empty;
    readonly microservices: { [key: string]: MicroserviceInContext } = {};

    abstract async describe(environment: ScenarioEnvironmentDefinition): Promise<void>;

    abstract async cleanup(): Promise<void>;

    get environment() { return this._environment; }

    async establish(environment: ScenarioEnvironment): Promise<void> {
        this._environment = environment;
        Object.entries(environment.microservices)
            .forEach(([microserviceName, microservice]) => this.microservices[microserviceName] = new MicroserviceInContext(microservice));
    }
}
