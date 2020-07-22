// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { ScenarioFor, Feature } from '@dolittle/testing.gherkin';
import { shared } from '@dolittle/aviator.microservices';
import { a_single_microservice } from '../given/a_single_microservice';

@Feature('Private aggregate events')
export class committing_an_aggregate_event_that_fails_in_handler extends ScenarioFor<a_single_microservice> {
    readonly event_source = Guid.parse('48451372-a24e-402e-b2eb-f2b1a05f0bb7');
    readonly version = 0;
    readonly event_committed: shared.EventObject = {
        uniqueIdentifier: Guid.create().toString(),
        fail: true
    };

    for = a_single_microservice;

    when_event_is_committed = async () => this.context?.commitAggregateEvents(this.event_source, this.version, this.event_committed);

    then_the_event_should_appear_in_the_event_log = () => this.context?.event_log?.should_contain(this.context?.tenant, this.event_committed);
    then_the_event_should_appear_in_the_event_handler_stream = () => this.context?.streams?.should_contain(this.context?.tenant, shared.EventHandlers.aggregateEventHandlerId, Guid.empty, this.event_committed);
    then_the_event_should_appear_in_the_unpartitioned_event_handler_stream = () => this.context?.streams?.should_contain(this.context?.tenant, shared.EventHandlers.unpartitionedAggregateEventHandlerId, Guid.empty, this.event_committed);
    then_the_event_handler_should_be_in_a_failing_state = () => this.context?.stream_processors?.should_have_failing_event_handler(this.context?.tenant, shared.EventHandlers.aggregateEventHandlerId);
    then_the_unpartitioned_event_handler_should_be_in_a_failing_state = () => this.context?.stream_processors?.should_have_failing_event_handler(this.context?.tenant, shared.EventHandlers.unpartitionedAggregateEventHandlerId);
    then_the_event_handler_should_try_processing_the_next_event = () => this.context?.stream_processors?.should_have_event_handler_at_position(this.context?.tenant, shared.EventHandlers.aggregateEventHandlerId, 1);
    then_it_should_have_the_correct_failing_partition = () => this.context?.stream_processors?.should_have_failing_partition(this.context?.tenant, shared.EventHandlers.aggregateEventHandlerId, this.event_source);
    then_the_unpartitioned_event_handler_should_be_at_the_same_event = () => this.context?.stream_processors?.should_have_event_handler_at_position(this.context?.tenant, shared.EventHandlers.unpartitionedAggregateEventHandlerId, 0);
}
