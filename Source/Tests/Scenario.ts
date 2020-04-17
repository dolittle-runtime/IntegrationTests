// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from './Constructor';
import { IGiven } from './IGiven';
import { ScenarioContext } from 'ScenarioContext';

export class Scenario {
    context: ScenarioContext | undefined;
    given: Constructor<IGiven> | undefined;
}
