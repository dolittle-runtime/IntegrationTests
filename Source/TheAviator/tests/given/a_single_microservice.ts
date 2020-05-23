// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ScenarioEnvironmentDefinition, ScenarioContext } from '../../gherkin';
import { Tenants } from '../shared/Tenants';
import { Artifacts } from '../shared/Artifacts';
import { EventLogRuleSetContainerBuilder, StreamsRuleSetContainerBuilder, StreamProcessorRuleSetContainerBuilder } from '../../rules';
import { MicroserviceInContext } from '../../gherkin/MicroserviceInContext';

export class a_single_microservice extends ScenarioContext {
    tenant = Tenants.tenant;

    async describe(environment: ScenarioEnvironmentDefinition) {
        environment.withMicroservice('main', [Guid.parse('f79fcfc9-c855-4910-b445-1f167e814bfd')]);
    }

    get microservice(): MicroserviceInContext | undefined {
        return this.microservices.main;
    }

    async commitEvent(eventSource: Guid, event: any) {
        await this.microservice?.actions.commitEvent(Tenants.tenant, eventSource, Artifacts.event, event);
    }

    async commitAggregateEvent(eventSource: Guid, version: number, event: any) {
        await this.microservice?.actions.commitAggregateEvent(Tenants.tenant, eventSource, version, Artifacts.aggregateEvent, event);
    }

    get event_log(): EventLogRuleSetContainerBuilder | undefined {
        return this.microservice?.event_log;
    }

    get streams(): StreamsRuleSetContainerBuilder | undefined {
        return this.microservice?.streams;
    }

    get stream_processors(): StreamProcessorRuleSetContainerBuilder | undefined {
        return this.microservice?.stream_processors;
    }
}
