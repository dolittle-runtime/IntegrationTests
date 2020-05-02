// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario, ScenarioEnvironment } from '../gherkin';

export class PreflightChecklist {
    readonly scenariosByEnvironment: Map<ScenarioEnvironment, Scenario[]>;

    constructor(scenariosByEnvironment: Map<ScenarioEnvironment, Scenario[]>) {
        this.scenariosByEnvironment = scenariosByEnvironment;
    }
}
