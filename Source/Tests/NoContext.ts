// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IGiven } from './IGiven';
import { ScenarioContext } from './ScenarioContext';

export class NoContext implements IGiven {
    describe(context: ScenarioContext): void {
    }
}
