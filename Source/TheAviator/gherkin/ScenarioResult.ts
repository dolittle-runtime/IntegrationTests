// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario } from './Scenario';
import { ScenarioContext } from './ScenarioContext';
import { ThenResult } from './ThenResult';

export class ScenarioResult {
    readonly scenario: Scenario;
    readonly context: ScenarioContext;
    readonly results: ThenResult[];

    constructor(scenario: Scenario, context: ScenarioContext, results: ThenResult[]) {
        this.scenario = scenario;
        this.context = context;
        this.results = results;
    }
}
