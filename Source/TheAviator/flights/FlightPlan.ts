// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario, ScenarioContextDefinition } from '../gherkin';

import { IFlightPaths } from 'flights/IFlightPaths';

export class FlightPlan {
    readonly paths: IFlightPaths;
    readonly scenariosByContexts: Map<ScenarioContextDefinition, Scenario[]>;

    constructor(paths: IFlightPaths, scenariosByContexts: Map<ScenarioContextDefinition, Scenario[]>) {
        this.paths = paths;
        this.scenariosByContexts = scenariosByContexts;
    }
}
