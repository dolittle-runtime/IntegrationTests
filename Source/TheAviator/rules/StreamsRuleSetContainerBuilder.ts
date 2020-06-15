// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { EventWithContentShouldBeInStream } from './EventWithContentShouldBeInStream';
import { Microservice } from '../microservices/Microservice';

import { ScenarioRuleSetContainerBuilder } from './ScenarioRuleSetContainerBuilder';
import { EventObject } from '../tests/shared/EventObject';

export class StreamsRuleSetContainerBuilder extends ScenarioRuleSetContainerBuilder {
    constructor(microservice: Microservice) {
        super(microservice);
    }

    should_contain = (tenantId: Guid, streamId: Guid, ...events: EventObject[]) => this.addRuleBuilderFor(new EventWithContentShouldBeInStream(tenantId, `stream-${streamId.toString()}`, ...events));
    should_be_in_public_stream = (tenantId: Guid, publicStreamId: Guid, ...events: EventObject[]) => this.addRuleBuilderFor(new EventWithContentShouldBeInStream(tenantId, `public-stream-${publicStreamId.toString()}`, ...events));
    should_be_in_external_event_log = (tenantId: Guid, externalScopeId: Guid, ...events: EventObject[]) => this.addRuleBuilderFor(new EventWithContentShouldBeInStream(tenantId, `x-${externalScopeId.toString()}-event-log`, ...events));
}
