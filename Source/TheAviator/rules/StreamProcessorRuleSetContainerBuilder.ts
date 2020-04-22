// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { Microservice } from '../microservices/Microservice';

import { StreamProcessorShouldBeAtPosition } from './StreamProcessorShouldBeAtPosition';
import { ScenarioRuleSetContainerBuilder } from './ScenarioRuleSetContainerBuilder';

export class StreamProcessorRuleSetContainerBuilder extends ScenarioRuleSetContainerBuilder {
    constructor(microservice: Microservice) {
        super(microservice);
    }

    should_have_event_handler_at_position = (tenantId: Guid, eventHandlerId: Guid, position: number) => this.addRuleBuilderFor(new StreamProcessorShouldBeAtPosition(tenantId, eventHandlerId, position));
}

