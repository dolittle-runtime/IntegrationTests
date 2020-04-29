// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioContextDefinition } from './ScenarioContextDefinition';
import { ScenarioContext } from './ScenarioContext';

export interface IGiven {
    describe(scenarioContext: ScenarioContextDefinition): void;

    establish(scenarioContext: ScenarioContext): Promise<void>;
}
