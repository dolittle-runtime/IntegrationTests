// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export class EventHorizonConfiguration {
    consumerTenant: string;
    producerTenant: string;
    microservice: string;
    scope: string;
    stream: string;

    constructor(consumerTenant: string, producerTenant: string, microservice: string, scope: string, stream: string) {
        this.consumerTenant = consumerTenant;
        this.producerTenant = producerTenant;
        this.microservice = microservice;
        this.scope = scope;
        this.stream = stream;
    }
}
