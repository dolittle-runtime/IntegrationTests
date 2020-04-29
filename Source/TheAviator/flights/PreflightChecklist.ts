// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario, ScenarioEnvironmentDefinition } from '../gherkin';

import { IFlightPaths } from './IFlightPaths';

export class PreflightChecklist {
    readonly paths: IFlightPaths;
    readonly scenariosByContexts: Map<ScenarioEnvironmentDefinition, Scenario[]>;

    constructor(paths: IFlightPaths, scenariosByContexts: Map<ScenarioEnvironmentDefinition, Scenario[]>) {
        this.paths = paths;
        this.scenariosByContexts = scenariosByContexts;
    }
}
