// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EventHandlers } from '../shared/EventHandlers';
import { EventObject } from '../shared/EventObject';
import { a_single_microservice } from '../given/a_single_microservice';
import { Feature, ScenarioFor } from '../../gherkin';

@Feature('Private aggregate events')
export class single_aggregate_event_committed extends ScenarioFor<a_single_microservice> {
    readonly eventSource = Guid.create();
    readonly version = 0;
    readonly event_committed: EventObject = {
        uniqueIdentifier: Guid.create().toString()
    };

    for = a_single_microservice;

    when_event_is_committed = async () => await this.context?.commitAggregateEvents(this.eventSource, this.version, this.event_committed);

    then_event_should_be_in_event_log = () => this.context?.event_log?.should_contain(this.context?.tenant, this.event_committed);
    then_event_should_appear_in_the_event_handler_stream = () => this.context?.streams?.should_contain(this.context?.tenant, EventHandlers.aggregateEventHandlerId, Guid.empty, this.event_committed);
    then_event_should_appear_in_the_unpartitioned_event_handler_stream = () => this.context?.streams?.should_contain(this.context?.tenant, EventHandlers.unpartitionedAggregateEventHandlerId, Guid.empty, this.event_committed);
    then_event_handler_should_have_handled_event = () => this.context?.stream_processors?.should_have_event_handler_at_position(this.context?.tenant, EventHandlers.aggregateEventHandlerId, 1);
    then_unpartitioned_event_handler_should_have_handled_event = () => this.context?.stream_processors?.should_have_event_handler_at_position(this.context?.tenant, EventHandlers.unpartitionedAggregateEventHandlerId, 1);
}
