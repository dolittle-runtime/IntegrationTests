// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Streams } from '../shared/Streams';
import { Scopes } from '../shared/Scopes';
import { EventHandlers } from '../shared/EventHandlers';
import { a_producer_and_a_consumer } from '../given/a_producer_and_a_consumer';

export class single_public_event_committed {
    context: a_producer_and_a_consumer | undefined;

    readonly event_committed: any = { 'uniqueIdentifier': Guid.create().toString() };

    when_event_is_committed = async () => await this.context?.producer?.commitPublicEvent(this.event_committed);

    then_event_should_be_in_event_log_of_producer_microservice = () => this.context?.producer?.event_log?.should_contain(this.context?.tenant, this.event_committed);
    then_event_should_be_in_public_stream_of_producer_microservice = () => this.context?.producer?.streams?.should_be_in_public_stream(this.context?.tenant, Streams.publicStream, this.event_committed);
    then_event_should_be_in_external_event_log_of_consumer_microservice = () => this.context?.consumer?.streams?.should_be_in_external_event_log(this.context?.tenant, Scopes.producerScope, this.event_committed);
    then_external_event_handler_should_have_been_handled = () => this.context?.consumer?.stream_processors?.should_have_event_handler_at_position(this.context?.tenant, EventHandlers.publicEventHandlerId, 1);
}
