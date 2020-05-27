// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import asyncTimeout from '../../asyncTimeout';
import { a_producer_and_a_consumer } from '../given/a_producer_and_a_consumer';
import { ScenarioFor, Feature } from '../../gherkin';
import { EventHandlers } from '../shared/EventHandlers';
import { Streams } from '../shared/Streams';
import { Scopes } from '../shared/Scopes';

@Feature('Public events')
export class committing_public_events_with_unstable_consumer extends ScenarioFor<a_producer_and_a_consumer> {
    for = a_producer_and_a_consumer;

    readonly event_source = Guid.parse('05712402-8f91-49f6-ad65-8c49b12c145c');
    readonly first_two_events: any[] = [
        { 'uniqueIdentifier': Guid.create().toString() },
        { 'uniqueIdentifier': Guid.create().toString() }
    ];

    readonly second_set_of_events: any[] = [
        { 'uniqueIdentifier': Guid.create().toString() },
        { 'uniqueIdentifier': Guid.create().toString() }
    ];

    readonly third_set_of_events: any[] = [
        { 'uniqueIdentifier': Guid.create().toString() },
        { 'uniqueIdentifier': Guid.create().toString() }
    ];

    readonly forth_set_of_events: any[] = [
        { 'uniqueIdentifier': Guid.create().toString() },
        { 'uniqueIdentifier': Guid.create().toString() }
    ];

    readonly all_events = this.first_two_events.concat(this.second_set_of_events).concat(this.third_set_of_events).concat(this.forth_set_of_events);

    when_events_are_committed = async () => await this.commit_two_events(this.first_two_events);

    and = () => [
        this.waiting_for_two_seconds,
        this.stopping_consumer_runtime,
        this.waiting_for_a_minute,
        this.committing_second_set_of_events,
        this.waiting_for_two_seconds,
        this.continuing_consumer_runtime,
        this.waiting_for_a_minute,
        this.committing_third_set_of_events,
        this.waiting_for_two_seconds,
        this.committing_forth_set_of_events
    ]

    committing_second_set_of_events = async () => await this.commit_two_events(this.second_set_of_events);
    committing_third_set_of_events = async () => await this.commit_two_events(this.third_set_of_events);
    committing_forth_set_of_events = async () => await this.commit_two_events(this.forth_set_of_events);
    waiting_for_two_seconds = async () => await asyncTimeout(2000);
    waiting_for_a_minute = async () => await asyncTimeout(60000);
    stopping_consumer_runtime = async () => await this.context?.consumer?.runtime.stop();
    continuing_consumer_runtime = async () => await this.context?.consumer?.runtime.continue();

    async commit_two_events(events: any[]) {
        for (const event of events) {
            this.context?.producer?.commitPublicEvent(this.event_source, event);
        }
    }

    then_all_events_should_be_in_event_log_of_producer_microservice = () => this.context?.producer?.event_log?.should_contain(this.context?.tenant, ...this.all_events);
    then_all_events_should_be_in_public_stream_of_producer_microservice = () => this.context?.producer?.streams?.should_be_in_public_stream(this.context?.tenant, Streams.publicStream, ...this.all_events);
    then_all_events_should_be_in_external_event_log_of_consumer_microservice = () => this.context?.consumer?.streams?.should_be_in_external_event_log(this.context?.tenant, Scopes.producerScope, ...this.all_events);
    then_external_event_handler_should_have_handled_them_all = () => this.context?.consumer?.stream_processors?.should_have_event_handler_at_position(this.context?.tenant, EventHandlers.publicEventHandlerId, 8, Scopes.producerScope);
}
