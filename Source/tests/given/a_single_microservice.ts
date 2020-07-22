// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { MicroserviceScenarioContext, MicroserviceInContext, MicroserviceScenarioEnvironmentDefinition, MicroserviceScenarioEnvironment} from '@dolittle/aviator.gherkin';
import { StreamsRuleSetContainerBuilder, StreamProcessorRuleSetContainerBuilder, EventLogRuleSetContainerBuilder } from '@dolittle/aviator.rules';
import { shared } from '@dolittle/aviator.microservices';

export class a_single_microservice extends MicroserviceScenarioContext {
    tenant = shared.Tenants.tenant;

    async describe(environment: MicroserviceScenarioEnvironmentDefinition) {
        environment.withMicroservice('main', [Guid.parse('f79fcfc9-c855-4910-b445-1f167e814bfd')]);
    }
    async cleanup(): Promise<void> {
        const restartPromises: Promise<void>[] = [];
        for (const microservice of Object.values(this.microservices!)) {
            restartPromises.push(microservice.head.restart());
        }
        await Promise.all(restartPromises);
    }

    get microservice(): MicroserviceInContext | undefined {
        return this.microservices.main;
    }

    async commitEvents(eventSource: Guid, ...events: shared.EventObject[]) {
        await this.microservice?.actions.commitEvents(shared.Tenants.tenant, eventSource, ...events);
    }

    async commitAggregateEvents(eventSource: Guid, version: number, ...events: shared.EventObject[]) {
        await this.microservice?.actions.commitAggregateEvents(shared.Tenants.tenant, eventSource, version, ...events);
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
