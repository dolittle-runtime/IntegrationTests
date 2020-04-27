// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { IGiven, ScenarioContextDefinition } from '../../gherkin';

export class a_producer_and_a_consumer implements IGiven {
    async describe(context: ScenarioContextDefinition) {
        context.withMicroservice('producer', [Guid.parse('f79fcfc9-c855-4910-b445-1f167e814bfd')]);
        context.withMicroservice('consumer', [Guid.parse('f79fcfc9-c855-4910-b445-1f167e814bfd')]);
        context.connectProducerToConsumer('producer', 'consumer');
    }
}
