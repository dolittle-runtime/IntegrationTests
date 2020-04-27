// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import asyncTimeout from '../../asyncTimeout';

import { scenario_for_a_single_microservice } from '../scenario_for_a_single_microservice';

export class two_events_with_pause_inbetween_committed extends scenario_for_a_single_microservice {
    readonly first_event_committed: any = { 'uniqueIdentifier': Guid.create().toString() };
    readonly second_event_committed: any = { 'uniqueIdentifier': Guid.create().toString() };

    async when_committing_two_events_with_pauses() {
        await this.commitEvent(this.first_event_committed);
        return [
            this.pausing_the_head,
            this.waiting_for_two_seconds,
            this.resuming_the_head,
            this.commit_another_event,
            this.waiting_for_two_seconds
        ];
    }

    pausing_the_head = async () => await this.microservice?.head.pause();
    commit_another_event = async () => await this.commitEvent(this.second_event_committed);
    resuming_the_head = async () => await this.microservice?.head.resume();
    waiting_for_two_seconds = async () => await asyncTimeout(2000);

    then_first_event_should_be_in_event_log = () => this.event_log?.should_contain(this.tenant, this.first_event_committed);
    then_second_event_should_be_in_event_log = () => this.event_log?.should_contain(this.tenant, this.second_event_committed);
}
