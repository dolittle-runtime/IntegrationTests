// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { EventWithContentShouldBeInStream } from './EventWithContentShouldBeInStream';
import { Microservice } from '../microservices/Microservice';

import { ScenarioRuleSetContainerBuilder } from './ScenarioRuleSetContainerBuilder';
import { EventObject } from '../tests/shared/EventObject';

export class EventLogRuleSetContainerBuilder extends ScenarioRuleSetContainerBuilder {
    constructor(microservice: Microservice) {
        super(microservice);
    }

    should_contain = (tenantId: Guid, ...events: EventObject[]) => this.addRuleBuilderFor(new EventWithContentShouldBeInStream(tenantId, 'event-log', ...events));
}
