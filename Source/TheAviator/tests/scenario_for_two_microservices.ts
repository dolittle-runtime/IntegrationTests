// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario } from '../gherkin';
import { two_microservices } from './two_microservices';

export class scenario_for_two_microservices extends Scenario {
    given = two_microservices;
}
