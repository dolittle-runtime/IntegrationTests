// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioContext } from './ScenarioContext';

export interface IGiven {
    describe(scenarioContext: ScenarioContext): void;
}
