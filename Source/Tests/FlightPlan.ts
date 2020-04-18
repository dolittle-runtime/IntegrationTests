// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario } from './Scenario';
import { ScenarioContext } from 'ScenarioContext';

export class FlightPlan {
    readonly outputPath: string;
    readonly scenarioContexts: ScenarioContext[];
    readonly scenarios: Scenario[];

    constructor(outputPath: string, scenarioContexts: ScenarioContext[], scenarios: Scenario[]) {
        this.outputPath = outputPath;
        this.scenarioContexts = scenarioContexts;
        this.scenarios = scenarios;
    }
}
