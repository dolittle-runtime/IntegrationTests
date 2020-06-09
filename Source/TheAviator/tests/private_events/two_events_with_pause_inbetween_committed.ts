// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import asyncTimeout from '../../asyncTimeout';
import { EventObject } from '../shared/EventObject';
import { EventHandlers } from '../shared/EventHandlers';
import { Feature, ScenarioFor } from '../../gherkin';
import { a_single_microservice } from '../given/a_single_microservice';

@Feature('Private events')
export class two_events_with_pause_inbetween_committed extends ScenarioFor<a_single_microservice> {
    readonly event_source = Guid.parse('a380c617-3f30-4f05-9572-10c8e68c18c7');
    readonly first_event_committed: EventObject = {
        uniqueIdentifier: Guid.create().toString()
    };
    readonly second_event_committed: EventObject = {
        uniqueIdentifier: Guid.create().toString()
    };

    for = a_single_microservice;

    when_events_are_committed = async () => await this.context?.commitEvents(this.event_source, this.first_event_committed);

    and = () => [
        this.pausing_the_head,
        this.waiting_for_two_seconds,
        this.resuming_the_head,
        this.commit_another_event,
        this.waiting_for_two_seconds
    ]

    pausing_the_head = async () => await this.context?.microservice?.head.pause();
    commit_another_event = async () => await this.context?.commitEvents(this.event_source, this.second_event_committed);
    resuming_the_head = async () => await this.context?.microservice?.head.resume();
    waiting_for_two_seconds = async () => await asyncTimeout(2000);

    then_first_event_should_be_in_event_log = () => this.context?.event_log?.should_contain(this.context?.tenant, this.first_event_committed);
    then_second_event_should_be_in_event_log = () => this.context?.event_log?.should_contain(this.context?.tenant, this.second_event_committed);
    then_all_events_should_appear_in_the_event_handler_stream = () => this.context?.streams?.should_contain(this.context?.tenant, EventHandlers.eventHandlerId, this.first_event_committed, this.second_event_committed);
    then_all_events_should_appear_in_the_unpartitioned_event_handler_stream = () => this.context?.streams?.should_contain(this.context?.tenant, EventHandlers.unpartitionedEventHandlerId, this.first_event_committed, this.second_event_committed);
    then_the_event_handler_should_have_handled_events = () => this.context?.stream_processors?.should_have_event_handler_at_position(this.context?.tenant, EventHandlers.eventHandlerId, 2);
    then_the_unpartitioned_event_handler_should_have_handled_events = () => this.context?.stream_processors?.should_have_event_handler_at_position(this.context?.tenant, EventHandlers.unpartitionedEventHandlerId, 2);
}
