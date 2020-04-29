// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { IGiven, ScenarioContextDefinition, ScenarioContext } from '../../gherkin';
import { Microservice } from 'microservices';
import { Tenants } from '../shared/Tenants';
import { Artifacts } from '../shared/Artifacts';
import { EventLogRuleSetContainerBuilder, StreamsRuleSetContainerBuilder, StreamProcessorRuleSetContainerBuilder } from '../../rules';

export class a_single_microservice implements IGiven {
    microservice: Microservice | undefined;
    tenant = Tenants.tenant;

    async describe(context: ScenarioContextDefinition) {
        context.withMicroservice('main', [Guid.parse('f79fcfc9-c855-4910-b445-1f167e814bfd')]);
    }

    async establish(scenarioContext: ScenarioContext) {
        this.microservice = scenarioContext.microservices.main;
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
