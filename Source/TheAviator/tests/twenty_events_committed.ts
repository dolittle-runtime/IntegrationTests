// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { scenario_for_a_single_microservice } from './scenario_for_a_single_microservice';

export class twenty_events_committed extends scenario_for_a_single_microservice {
    readonly _events: any[] = [];

    constructor() {
        super();
        for (let i = 0; i < 20; i += 1) {
            this._events.push({ 'uniqueIdentifier': Guid.create().toString() });
        }
    }

    async when_committing_twenty_events() {
        for (const event of this._events) {
            await this.commitEvent(event);
        }
    }

    then_all_events_should_be_in_event_log = () => this.event_log?.should_contain(this.tenant, this._events);
}