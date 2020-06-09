// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { Microservice } from '../../microservices';
import { StreamProcessorShouldBeFailing, StreamProcessorShouldBeAtPosition, StreamProcessorShouldHaveFailingPartition } from './';
import { ScenarioRuleSetContainerBuilder } from '../';

export class StreamProcessorRuleSetContainerBuilder extends ScenarioRuleSetContainerBuilder {
    constructor(microservice: Microservice) {
        super(microservice);
    }

    should_have_event_handler_at_position = (tenantId: Guid, eventHandlerId: Guid, position: number, scopeId: Guid = Guid.empty) => this.addRuleBuilderFor(new StreamProcessorShouldBeAtPosition(tenantId, eventHandlerId, scopeId, position));
    should_have_failing_event_handler = (tenantId: Guid, eventHandlerId: Guid, scopeId: Guid = Guid.empty) => this.addRuleBuilderFor(new StreamProcessorShouldBeFailing(tenantId, eventHandlerId, scopeId));
    should_have_failing_partition = (tenantId: Guid, eventHandlerId: Guid, partitionId: Guid, scopeId: Guid = Guid.empty) => this.addRuleBuilderFor(new StreamProcessorShouldHaveFailingPartition(tenantId, eventHandlerId, scopeId, partitionId));
}

