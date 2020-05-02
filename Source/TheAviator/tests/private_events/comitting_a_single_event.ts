// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { EventHandlers } from '../shared/EventHandlers';
import { Feature, ScenarioFor } from '../../gherkin';
import { a_single_microservice } from '../given/a_single_microservice';

@Feature('Private events')
export class committing_a_single_event extends ScenarioFor<a_single_microservice> {
    readonly event_committed: any = { 'uniqueIdentifier': Guid.create().toString() };

    for = a_single_microservice;

    when_event_is_committed = async () => await this.context?.commitEvent(this.event_committed);

    then_the_event_should_appear_in_the_event_log = () => this.context?.event_log?.should_contain(this.context?.tenant, this.event_committed);
    then_the_event_should_appear_in_the_stream_for_processor = () => this.context?.streams?.should_contain(this.context?.tenant, EventHandlers.eventHandlerId, this.event_committed);
    then_the_event_handler_should_have_been_handled = () => this.context?.stream_processors?.should_have_event_handler_at_position(this.context?.tenant, EventHandlers.eventHandlerId, 1);
}
