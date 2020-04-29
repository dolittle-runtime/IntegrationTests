// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Microservice } from 'microservices';
import { Tenants } from '../shared/Tenants';
import { Artifacts } from '../shared/Artifacts';
import { Guid } from '@dolittle/rudiments';
import { EventLogRuleSetContainerBuilder, StreamsRuleSetContainerBuilder, StreamProcessorRuleSetContainerBuilder } from 'rules';

export class MicroserviceRepresentation {
    readonly microservice: Microservice;
    constructor(microservice: Microservice) {
        this.microservice = microservice;
    }
    get event_log(): EventLogRuleSetContainerBuilder | undefined {
        return this.microservice.eventStore.eventLog;
    }
    get streams(): StreamsRuleSetContainerBuilder | undefined {
        return this.microservice.eventStore.streams;
    }
    get stream_processors(): StreamProcessorRuleSetContainerBuilder | undefined {
        return this.microservice.eventStore.streamProcessors;
    }
    async commitEventInFirst(event: any) {
        await this.microservice.actions.commitEvent(Tenants.tenant, Artifacts.event, event);
    }
    async commitAggregateEventInFirst(eventSource: Guid, version: number, event: any) {
        await this.microservice.actions.commitAggregateEvent(Tenants.tenant, eventSource, version, Artifacts.aggregateEvent, event);
    }
    async commitPublicEvent(event: any) {
        await this.microservice.actions.commitPublicEvent(Tenants.tenant, Artifacts.event, event);
    }
}
