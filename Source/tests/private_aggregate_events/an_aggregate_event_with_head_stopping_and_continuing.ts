// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { ScenarioFor, Feature } from '@dolittle/testing.gherkin';
import { shared } from '@dolittle/aviator.microservices';
import { a_single_microservice } from '../given/a_single_microservice';

@Feature('Private aggregate events')
export class an_aggregate_event_with_head_stopping_and_continuing extends ScenarioFor<a_single_microservice> {
    readonly eventSource = Guid.create();
    readonly version = 0;
    readonly event_committed: shared.EventObject = {
        uniqueIdentifier: Guid.create().toString()
    };

    for = a_single_microservice;

    when_event_is_committed = async () => this.context?.commitAggregateEvents(this.eventSource, this.version, this.event_committed);

    and = () => [
        this.stopping_the_head,
        this.continuing_the_head
    ];

    stopping_the_head = async () => this.context?.microservice?.head.stop();
    continuing_the_head = async () => this.context?.microservice?.head.continue();

    then_event_should_be_in_event_log = () => this.context?.microservice?.event_log?.should_contain(this.context?.tenant, this.event_committed);
    then_event_should_appear_in_the_event_handler_stream = () => this.context?.microservice?.streams?.should_contain(this.context?.tenant, shared.EventHandlers.aggregateEventHandlerId, Guid.empty, this.event_committed);
    then_event_should_appear_in_the_unpartitioned_event_handler_stream = () => this.context?.microservice?.streams?.should_contain(this.context?.tenant, shared.EventHandlers.unpartitionedAggregateEventHandlerId, Guid.empty, this.event_committed);
    then_event_handler_should_have_handled_event = () => this.context?.microservice?.stream_processors?.should_have_event_handler_at_position(this.context?.tenant, shared.EventHandlers.aggregateEventHandlerId, 1);
    then_unpartitioned_event_handler_should_have_handled_event = () => this.context?.microservice?.stream_processors?.should_have_event_handler_at_position(this.context?.tenant, shared.EventHandlers.unpartitionedAggregateEventHandlerId, 1);
}
