// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { EventWithContentShouldBeInStream } from './EventWithContentShouldBeInStream';
import { Microservice } from '../microservices/Microservice';

import { ScenarioRuleSetContainerBuilder } from './ScenarioRuleSetContainerBuilder';

export class StreamsRuleSetContainerBuilder extends ScenarioRuleSetContainerBuilder {
    constructor(microservice: Microservice) {
        super(microservice);
    }

    should_contain = (tenantId: Guid, streamId: Guid, ...events: any[]) => this.addRuleBuilderFor(new EventWithContentShouldBeInStream(tenantId, `stream-${streamId.toString()}`, events));
}
