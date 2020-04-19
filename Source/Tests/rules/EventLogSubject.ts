// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Microservice } from '../Microservice';
import { ScenarioSubject } from './ScenarioSubject';

export class EventLogSubject extends ScenarioSubject {
    readonly microservice: Microservice;

    constructor(microservice: Microservice, scenario: string, then: string) {
        super(scenario, then);
        this.microservice = microservice;
    }
}
