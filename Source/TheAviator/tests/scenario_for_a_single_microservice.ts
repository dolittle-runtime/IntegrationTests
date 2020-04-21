// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario } from '../gherkin';

import { Microservice } from '../microservices';

import { a_single_microservice } from './a_single_microservice';
import { EventLogRuleSetContainerBuilder } from 'rules/EventLogRuleSetContainerBuilder';
import { Guid } from '@dolittle/rudiments';

export class scenario_for_a_single_microservice extends Scenario {
    given = a_single_microservice;

    microservice: Microservice | undefined;

    async when() {
        this.microservice = this.context?.microservices.main;
        return super.when();
    }

    async commitEvent(event: any) {
        await this.microservice?.actions.commitEvent(Guid.parse('0e984977-1686-4036-98ef-14dc9f55f705'), event);
    }

    get event_log(): EventLogRuleSetContainerBuilder | undefined {
        return this.microservice?.eventStore.eventLog;
    }
}
