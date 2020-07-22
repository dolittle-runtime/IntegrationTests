// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { ScenarioFor, Feature } from '@dolittle/testing.gherkin';
import { shared } from '@dolittle/aviator.microservices';
import { a_single_microservice } from '../given/a_single_microservice';

@Feature('Private events')
export class committing_an_event_that_fails_in_handler extends ScenarioFor<a_single_microservice> {
    readonly event_source = Guid.parse('48451372-a24e-402e-b2eb-f2b1a05f0bb7');
    readonly event_committed: shared.EventObject = {
        uniqueIdentifier: Guid.create().toString(),
        fail: true
    };

    for = a_single_microservice;

    when_event_is_committed = async () => this.context?.commitEvents(this.event_source, this.event_committed);

    then_the_event_should_appear_in_the_event_log = () => this.context?.event_log?.should_contain(this.context?.tenant, this.event_committed);
    then_the_event_should_appear_in_the_stream_for_processor = () => this.context?.streams?.should_contain(this.context?.tenant, shared.EventHandlers.eventHandlerId, Guid.empty, this.event_committed);
    then_the_event_handler_should_be_in_a_failing_state = () => this.context?.stream_processors?.should_have_failing_event_handler(this.context?.tenant, shared.EventHandlers.eventHandlerId);
    then_the_event_handler_stream_processor_try_processing_the_next_event = () => this.context?.stream_processors?.should_have_event_handler_at_position(this.context?.tenant, shared.EventHandlers.eventHandlerId, 1);
}
