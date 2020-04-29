// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Microservice } from '../microservices';
import { ScenarioEnvironmentDefinition } from './ScenarioEnvironmentDefinition';

export class ScenarioEnvironment {
    static empty: ScenarioEnvironment = new ScenarioEnvironment(new ScenarioEnvironmentDefinition('empty'),{});

    readonly name: string;
    readonly definition: ScenarioEnvironmentDefinition;
    readonly microservices: {[key: string]: Microservice};

    constructor(definition: ScenarioEnvironmentDefinition, microservices: {[key: string]: Microservice}) {
        this.name = definition.name;
        this.definition = definition;
        this.microservices = microservices;
    }
}
