// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export class EventHorizonTenantConsentConfiguration {
    producerTenant: string;
    consumerTenant: string;
    microservice: string;
    stream: string;

    constructor(producerTenant: string, consumerTenant: string, microservice: string, stream: string) {
        this.producerTenant = producerTenant;
        this.consumerTenant = consumerTenant;
        this.microservice = microservice;
        this.stream = stream;
    }
}
