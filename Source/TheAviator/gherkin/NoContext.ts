// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IGiven } from './IGiven';
import { ScenarioContextDefinition } from './ScenarioContextDefinition';
import { ScenarioContext } from './ScenarioContext';

export class NoContext implements IGiven {
    describe(context: ScenarioContextDefinition): void {
    }

    async establish(scenarioContext: ScenarioContext): Promise<void> {
    }
}
