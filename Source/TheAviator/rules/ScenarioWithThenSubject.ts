// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Microservice } from '../microservices/Microservice';

export class ScenarioWithThenSubject {
    readonly microservice: Microservice;
    readonly scenario: string;
    readonly then: string;

    constructor(microservice: Microservice, scenario: string, then: string) {
        this.microservice = microservice;
        this.scenario = scenario;
        this.then = then;
    }
}
