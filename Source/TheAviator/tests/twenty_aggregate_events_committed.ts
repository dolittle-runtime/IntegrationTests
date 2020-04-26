// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { scenario_for_a_single_microservice } from './scenario_for_a_single_microservice';

export class twenty_aggregate_events_committed extends scenario_for_a_single_microservice {
    readonly eventSource = Guid.create();
    readonly _events: any[] = [];

    constructor() {
        super();
        for (let i = 0; i < 20; i += 1) {
            this._events.push({ 'uniqueIdentifier': Guid.create().toString() });
        }
    }

    async when_committing_twenty_aggregate_events() {
        let version = 0;
        for (const event of this._events) {
            await this.commitAggregateEvent(this.eventSource, version, event);
            version = version + 1;
        }
    }

    then_all_events_should_be_in_event_log = () => this.event_log?.should_contain(this.tenant, ...this._events);
    then_all_events_should_be_in_stream_for_processor = () => this.streams?.should_contain(this.tenant, this.aggregateEventHandlerId, ...this._events);
    then_event_handler_should_have_handled_all = () => this.stream_processors?.should_have_event_handler_at_position(this.tenant, this.aggregateEventHandlerId, 20);
}