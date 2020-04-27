// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { scenario_for_a_single_microservice } from '../scenario_for_a_single_microservice';
import { EventHandlers } from '../shared/EventHandlers';

export class single_aggregate_event_committed extends scenario_for_a_single_microservice {
    readonly eventSource = Guid.create();
    readonly version = 0;
    readonly event_committed: any = { 'uniqueIdentifier': Guid.create().toString() };

    async when_committing_a_single_aggregate_event() {
        await this.commitAggregateEvent(this.eventSource, this.version, this.event_committed);
    }

    then_event_should_be_in_event_log = () => this.event_log?.should_contain(this.tenant, this.event_committed);
    then_event_should_be_in_stream_for_processor = () => this.streams?.should_contain(this.tenant, EventHandlers.aggregateEventHandlerId, this.event_committed);
    then_event_handler_should_have_been_handled = () => this.stream_processors?.should_have_event_handler_at_position(this.tenant, EventHandlers.aggregateEventHandlerId, 1);
}