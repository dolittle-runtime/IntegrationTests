// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { scenario_for_two_microservices } from './scenario_for_two_microservices';

export class single_public_event_committed extends scenario_for_two_microservices {
    readonly event_committed: any = { 'uniqueIdentifier': Guid.create().toString() };

    async when_committing_a_single_public_event() {

    }

    then_awesomeness = () => {};
}
