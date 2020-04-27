// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario } from '../gherkin';

import { Microservice } from '../microservices';

import { a_single_microservice } from './given/a_single_microservice';
import { EventLogRuleSetContainerBuilder, StreamProcessorRuleSetContainerBuilder, StreamsRuleSetContainerBuilder } from '../rules';
import { Guid } from '@dolittle/rudiments';
import { Tenants } from './shared/Tenants';
import { Artifacts } from './shared/Artifacts';

export class scenario_for_a_single_microservice extends Scenario {
    tenant: Guid = Tenants.tenant;

    given = a_single_microservice;

    microservice: Microservice | undefined;

    async establish() {
        this.microservice = this.context?.microservices.main;
    }

    async commitEvent(event: any) {
        await this.microservice?.actions.commitEvent(Tenants.tenant, Artifacts.event, event);
    }

    async commitAggregateEvent(eventSource: Guid, version: number, event: any) {
        await this.microservice?.actions.commitAggregateEvent(Tenants.tenant, eventSource, version, Artifacts.aggregateEvent, event);
    }

    get event_log(): EventLogRuleSetContainerBuilder | undefined {
        return this.microservice?.eventStore.eventLog;
    }

    get streams(): StreamsRuleSetContainerBuilder | undefined {
        return this.microservice?.eventStore.streams;
    }

    get stream_processors(): StreamProcessorRuleSetContainerBuilder | undefined {
        return this.microservice?.eventStore.streamProcessors;
    }
}
