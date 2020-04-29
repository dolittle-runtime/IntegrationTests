// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EventHandlers } from '../shared/EventHandlers';
import { a_single_microservice } from '../given/a_single_microservice';
import { Feature, ScenarioFor } from '../../gherkin';

@Feature('Private aggregate events')
export class twenty_aggregate_events_committed extends ScenarioFor<a_single_microservice> {
    readonly eventSource = Guid.create();
    readonly _events: any[] = [];

    constructor() {
        super();

        for (let i = 0; i < 20; i += 1) {
            this._events.push({ 'uniqueIdentifier': Guid.create().toString() });
        }
    }

    for = a_single_microservice;

    async when_all_events_are_committed() {
        let version = 0;
        for (const event of this._events) {
            await this.context?.commitAggregateEvent(this.eventSource, version, event);
            version = version + 1;
        }
    }

    then_all_events_should_be_in_event_log = () => this.context?.event_log?.should_contain(this.context?.tenant, ...this._events);
    then_all_events_should_be_in_stream_for_processor = () => this.context?.streams?.should_contain(this.context?.tenant, EventHandlers.aggregateEventHandlerId, ...this._events);
    then_event_handler_should_have_handled_all = () => this.context?.stream_processors?.should_have_event_handler_at_position(this.context?.tenant, EventHandlers.aggregateEventHandlerId, 20);
}