// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IGiven } from '../gherkin/IGiven';
import { ScenarioContext } from '../gherkin/ScenarioContext';
import { Guid } from '@dolittle/rudiments';

export class a_single_microservice implements IGiven {
    async describe(context: ScenarioContext) {
        context.withMicroservice('main', [Guid.parse('f79fcfc9-c855-4910-b445-1f167e814bfd')]);
    }
}
