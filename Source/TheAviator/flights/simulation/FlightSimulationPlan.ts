// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario, ScenarioEnvironment } from '../../gherkin';
import { ScenarioForSimulation } from './ScenarioForSimulation';
import { FlightSimulationOptions } from './FlightSimulationOptions';

export class FlightSimulationPlan {
    readonly options: FlightSimulationOptions;
    readonly environment: ScenarioEnvironment;
    readonly scenarios: ScenarioForSimulation[];

    constructor(options: FlightSimulationOptions, environment: ScenarioEnvironment, scenarios: ScenarioForSimulation[]) {
        this.options = options;
        this.environment = environment;
        this.scenarios = scenarios;
    }

    getRandomScenario(): Scenario {
        const index = Math.round(Math.random() * this.scenarios.length);
        const scenarioFor = this.scenarios[index % this.scenarios.length];
        return scenarioFor.getInstance();
    }
}
