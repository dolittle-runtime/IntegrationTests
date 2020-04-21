// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Microservice } from '../microservices';

export class ScenarioContext {
    readonly name: string;
    readonly microservices: {[key: string]: Microservice};

    constructor(name: string, microservices: {[key: string]: Microservice}) {
        this.name = name;
        this.microservices = microservices;
    }
}
