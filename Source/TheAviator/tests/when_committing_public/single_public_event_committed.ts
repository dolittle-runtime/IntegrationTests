// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { scenario_for_two_microservices } from '../scenario_for_two_microservices';
import { Streams } from '../shared/Streams';
import { Scopes } from '../shared/Scopes';

export class single_public_event_committed extends scenario_for_two_microservices {
    readonly event_committed: any = { 'uniqueIdentifier': Guid.create().toString() };

    async when_committing_a_single_public_event() {
        await this.producer?.commitPublicEvent(this.event_committed);
    }

    then_event_should_be_in_event_log_of_producer_microservice = () => this.producer?.event_log?.should_contain(this.tenant, this.event_committed);
    then_event_should_be_in_public_stream_of_producer_microservice = () => this.producer?.streams?.should_be_in_public_stream(this.tenant, Streams.publicStream, this.event_committed);
    then_event_should_be_in_external_event_log_of_consumer_microservice = () => this.consumer?.streams?.should_be_in_external_event_log(this.tenant, Scopes.producerScope, this.event_committed);
}
