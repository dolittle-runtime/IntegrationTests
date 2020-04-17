// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Microservice } from './Microservice';

export class ScenarioContext {
    readonly microservices: Map<string, Microservice>;

    constructor(microservices: Map<string, Microservice>) {
        this.microservices = microservices;
    }
}
