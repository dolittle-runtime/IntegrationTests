// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Microservice } from '../microservices';
import { ScenarioEnvironmentDefinition } from './ScenarioEnvironmentDefinition';

export type MicroserviceMethod = (microservice: Microservice) => Promise<void>;

export class ScenarioEnvironment {
    static empty: ScenarioEnvironment = new ScenarioEnvironment(new ScenarioEnvironmentDefinition(), {});

    readonly definition: ScenarioEnvironmentDefinition;
    readonly microservices: { [key: string]: Microservice };

    constructor(definition: ScenarioEnvironmentDefinition, microservices: { [key: string]: Microservice }) {
        this.definition = definition;
        this.microservices = microservices;
    }

    async start(): Promise<void> {
        await this.performOnEachMicroservice(_ => _.start());
    }

    async stop(): Promise<void> {
        await this.performOnEachMicroservice(_ => _.stop());
    }

    async performOnEachMicroservice(method: MicroserviceMethod) {
        for (const microservice of Object.values(this.microservices)) {
            await method(microservice);
        }
    }
}
