// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario } from '../gherkin';

import { Microservice } from '../microservices';

import { a_single_microservice } from './a_single_microservice';
import { EventLogRuleSetContainerBuilder, StreamProcessorRuleSetContainerBuilder } from '../rules';
import { Guid } from '@dolittle/rudiments';

export class scenario_for_a_single_microservice extends Scenario {
    protected tenant = Guid.parse('f79fcfc9-c855-4910-b445-1f167e814bfd');

    protected eventHandlerId = Guid.parse('3dbe18b8-c74f-4b57-9c60-f88de4b024a5');
    protected aggregateEventHandlerId = Guid.parse('2a494827-841c-43c2-b163-238ac9314f4a');

    given = a_single_microservice;

    microservice: Microservice | undefined;

    async when() {
        this.microservice = this.context?.microservices.main;
        return super.when();
    }

    async commitEvent(event: any) {
        await this.microservice?.actions.commitEvent(this.tenant, Guid.parse('0e984977-1686-4036-98ef-14dc9f55f705'), event);
    }

    async commitAggregateEvent(eventSource: Guid, version: number, event: any) {
        await this.microservice?.actions.commitAggregateEvent(this.tenant, eventSource, version, Guid.parse('0e984977-1686-4036-98ef-14dc9f55f705'), event);
    }

    get event_log(): EventLogRuleSetContainerBuilder | undefined {
        return this.microservice?.eventStore.eventLog;
    }

    get stream_processors(): StreamProcessorRuleSetContainerBuilder | undefined {
        return this.microservice?.eventStore.streamProcessors;
    }
}
