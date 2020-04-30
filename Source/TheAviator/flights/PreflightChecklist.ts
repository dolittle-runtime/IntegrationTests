// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario, ScenarioEnvironmentDefinition, ScenarioEnvironment } from '../gherkin';

import { IFlightPaths } from './IFlightPaths';

export class PreflightChecklist {
    readonly paths: IFlightPaths;
    readonly scenariosByEnvironment: Map<ScenarioEnvironment, Scenario[]>;

    constructor(paths: IFlightPaths, scenariosByEnvironment: Map<ScenarioEnvironment, Scenario[]>) {
        this.paths = paths;
        this.scenariosByEnvironment = scenariosByEnvironment;
    }
}
