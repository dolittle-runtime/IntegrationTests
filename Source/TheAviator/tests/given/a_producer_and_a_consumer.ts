// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ScenarioEnvironmentDefinition, ScenarioEnvironment, ScenarioContext } from '../../gherkin';
import { MicroserviceInContext } from '../../gherkin/MicroserviceInContext';
import { Tenants } from '../shared/Tenants';
import { EventObject } from '../shared/EventObject';
import { Scopes } from '../shared/Scopes';
import { Streams } from '../shared/Streams';

export class a_producer_and_a_consumer extends ScenarioContext {
    tenant: Guid = Tenants.tenant;

    producer: MicroserviceInContext | undefined;
    consumer: MicroserviceInContext | undefined;

    async describe(environment: ScenarioEnvironmentDefinition) {
        environment.withMicroservice('producer', [Guid.parse('f79fcfc9-c855-4910-b445-1f167e814bfd')]);
        environment.withMicroservice('consumer', [Guid.parse('8d9ef33f-5999-4539-a834-1b0a521a5524')]);
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
        await Promise.all([
            this.producer.actions.head.startClient(),
            this.consumer.actions.head.startClient()
        ]);
        await this.consumer.actions.head.subscribeToEventHorizon({
                consumerTenant: this.tenant.toString(),
                producerMicroservice: this.producer.microservice.configuration.identifier,
                producerTenant: this.tenant.toString(),
                producerStream: Streams.publicStream.toString(),
                producerPartition: Guid.empty.toString(),
                consumerScope: Scopes.producerScope.toString()
        });
    }

    async commitPublicEvents(eventSource: Guid, ...events: EventObject[]) {
        await this.producer?.actions.head.commitPublicEvents(this.tenant, eventSource, ...events);
    }
}
