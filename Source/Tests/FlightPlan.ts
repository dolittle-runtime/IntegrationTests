// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario } from './Scenario';
import { ScenarioContext } from 'ScenarioContext';

export class FlightPlan {
    readonly outputPath: string;
    readonly scenariosByContexts: Map<ScenarioContext, Scenario[]>;

    constructor(outputPath: string, scenariosByContexts: Map<ScenarioContext, Scenario[]>) {
        this.outputPath = outputPath;
        this.scenariosByContexts = scenariosByContexts;
    }
}
