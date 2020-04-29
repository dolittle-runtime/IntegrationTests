// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ScenarioEnvironmentDefinition, ScenarioEnvironment, ScenarioContext } from '../../gherkin';
import { MicroserviceInContext } from '../../gherkin/MicroserviceInContext';
import { Tenants } from '../shared/Tenants';

export class a_producer_and_a_consumer extends ScenarioContext {
    tenant: Guid = Tenants.tenant;

    producer: MicroserviceInContext | undefined;
    consumer: MicroserviceInContext | undefined;

    async describe(environment: ScenarioEnvironmentDefinition) {
        environment.withMicroservice('producer', [Guid.parse('f79fcfc9-c855-4910-b445-1f167e814bfd')]);
        environment.withMicroservice('consumer', [Guid.parse('f79fcfc9-c855-4910-b445-1f167e814bfd')]);
        environment.connectProducerToConsumer('producer', 'consumer');
    }

    async establish(environment: ScenarioEnvironment) {
        await super.establish(environment);
        this.producer = this.microservices.producer;
        this.consumer = this.microservices.consumer;
    }
}
