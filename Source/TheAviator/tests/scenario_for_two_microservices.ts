// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario } from '../gherkin';
import { a_producer_and_a_consumer } from './given/a_producer_and_a_consumer';
import { MicroserviceRepresentation } from './MicroserviceRepresentation';
import { Guid } from '@dolittle/rudiments';
import { Tenants } from './shared/Tenants';

export class scenario_for_two_microservices extends Scenario {
    tenant: Guid = Tenants.tenant;

    given = a_producer_and_a_consumer;

    producer: MicroserviceRepresentation | undefined;
    consumer: MicroserviceRepresentation | undefined;

    async establish() {
        if (this.context) {
            this.producer = new MicroserviceRepresentation(this.context.microservices.producer);
            this.consumer = new MicroserviceRepresentation(this.context.microservices.consumer);
        }
    }
}
