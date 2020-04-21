// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import asyncTimeout from '../asyncTimeout';

import { Guid } from '@dolittle/rudiments';
import { scenario_for_a_single_microservice } from './scenario_for_a_single_microservice';

export class single_events_committed extends scenario_for_a_single_microservice {
    readonly first_event_committed: any = { 'uniqueIdentifier': Guid.create().toString() };
    readonly second_event_committed: any = { 'uniqueIdentifier': Guid.create().toString() };

    async when_committing_a_single_event() {
        await this.microservice?.actions.commitEvent(Guid.parse('0e984977-1686-4036-98ef-14dc9f55f705'), this.first_event_committed);
        return [
            this.pausing_the_head,
            this.waiting_for_two_seconds,
            this.resuming_the_head,
            this.commit_another_event
        ];
    }

    pausing_the_head = async () => await this.microservice?.head.pause();
    commit_another_event = async () => await this.microservice?.actions.commitEvent(Guid.parse('0e984977-1686-4036-98ef-14dc9f55f705'), this.second_event_committed);
    resuming_the_head = async () => await this.microservice?.head.resume();
    waiting_for_two_seconds = async () => await asyncTimeout(2000);

    then_first_event_should_be_in_event_log = () => this.microservice?.event_log?.should_contain(this.first_event_committed);
    then_second_event_should_be_in_event_log = () => this.microservice?.event_log?.should_contain(this.second_event_committed);
}
