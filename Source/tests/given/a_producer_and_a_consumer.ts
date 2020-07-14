// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ScenarioEnvironmentDefinition, ScenarioEnvironment, ScenarioContext } from '@dolittle/aviator/Source/gherkin';
import { MicroserviceInContext } from '@dolittle/aviator/Source/gherkin/MicroserviceInContext';
import { Tenants } from '@dolittle/aviator/Source/microservices/shared/Tenants';
import { EventObject } from '@dolittle/aviator/Source/microservices/shared/EventObject';

export class a_producer_and_a_consumer extends ScenarioContext {
    tenant: Guid = Tenants.tenant;

    producer: MicroserviceInContext | undefined;
    consumer: MicroserviceInContext | undefined;

    async describe(environment: ScenarioEnvironmentDefinition) {
        environment.withMicroservice('producer', [Guid.parse('f79fcfc9-c855-4910-b445-1f167e814bfd')]);
        environment.withMicroservice('consumer', [Guid.parse('f79fcfc9-c855-4910-b445-1f167e814bfd')]);
        environment.connectProducerToConsumer('producer', 'consumer');
    }

    async cleanup(): Promise<void> {
        const restartPromises: Promise<void>[] = [];
        for (const microservice of Object.values(this.microservices!)) {
            restartPromises.push(microservice.head.restart(), microservice.runtime.restart());
        }
        await Promise.all(restartPromises);
    }

    async establish(environment: ScenarioEnvironment) {
        await super.establish(environment);
        this.producer = this.microservices.producer;
        this.consumer = this.microservices.consumer;
    }

    async commitPublicEvents(eventSource: Guid, ...events: EventObject[]) {
        await this.producer?.actions.commitPublicEvents(Tenants.tenant, eventSource, ...events);
    }
}
