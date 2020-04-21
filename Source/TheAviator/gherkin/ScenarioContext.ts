// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Microservice } from '../microservices';
import { ScenarioContextDefinition } from './ScenarioContextDefinition';

export class ScenarioContext {
    readonly name: string;
    readonly definition: ScenarioContextDefinition;
    readonly microservices: {[key: string]: Microservice};

    constructor(definition: ScenarioContextDefinition, microservices: {[key: string]: Microservice}) {
        this.name = definition.name;
        this.definition = definition;
        this.microservices = microservices;
    }
}
