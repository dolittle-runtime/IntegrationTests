// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioContext } from '../ScenarioContext';
import { ScenarioEnvironmentDefinition } from '../ScenarioEnvironmentDefinition';

export class MyContext extends ScenarioContext {
    async describe(environment: ScenarioEnvironmentDefinition): Promise<void> {
    }
    async cleanup(): Promise<void> {
    }
}
