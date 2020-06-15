// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { EventHandlers } from '../shared/EventHandlers';
import { EventObject } from '../shared/EventObject';
import { Feature, ScenarioFor } from '../../gherkin';
import { a_single_microservice } from '../given/a_single_microservice';

@Feature('Private events')
export class committing_a_single_event_and_stopping_the_head extends ScenarioFor<a_single_microservice> {
    readonly event_source = Guid.parse('aa9aaac9-fa3b-442f-a704-7df8fee1ee86');
    readonly event_committed: EventObject = {
        uniqueIdentifier: Guid.create().toString()
    };

    for = a_single_microservice;

    when_event_is_committed = async () => await this.context?.commitEvents(this.event_source, this.event_committed);


    and = () => [
        this.stopping_the_head,
        this.continuing_the_head
    ];

    stopping_the_head = async () => await this.context?.microservice?.head.stop();
    continuing_the_head = async () => await this.context?.microservice?.head.continue();

    then_the_event_should_appear_in_the_event_log = () => this.context?.event_log?.should_contain(this.context?.tenant, this.event_committed);
    then_the_event_should_appear_in_the_event_handler_stream = () => this.context?.streams?.should_contain(this.context?.tenant, EventHandlers.eventHandlerId, Guid.empty, this.event_committed);
    then_the_event_should_appear_in_the_unpartitioned_event_handler_stream = () => this.context?.streams?.should_contain(this.context?.tenant, EventHandlers.unpartitionedEventHandlerId, Guid.empty, this.event_committed);
    then_the_event_handler_should_have_handled_an_event = () => this.context?.stream_processors?.should_have_event_handler_at_position(this.context?.tenant, EventHandlers.eventHandlerId, 1);
    then_the_unpartitioned_event_handler_should_have_handled_an_event = () => this.context?.stream_processors?.should_have_event_handler_at_position(this.context?.tenant, EventHandlers.unpartitionedEventHandlerId, 1);
}
