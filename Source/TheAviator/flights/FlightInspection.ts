// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Flight } from './Flight';
import { IFlightInspection } from './IFlightInspection';
import { ISpecificationRunner, ScenarioResult, Scenario, ScenarioEnvironment } from '../gherkin';

export class FlightInspection implements IFlightInspection {
    constructor(private _flight: Flight, private _specificationRunner: ISpecificationRunner) {
    }

    async runPreflightCheck(): Promise<void> {
        for (const [environment, scenarios] of this._flight.preflightChecklist.scenariosByEnvironment) {
            this._flight.environment.next(environment);

            await environment.start();

            for (const scenario of scenarios) {
                await this.recordScenario(
                    await this.runScenario(scenario, environment),
                    scenario,
                    environment);
                await this.cleanupAfterScenario(scenario, environment);
            }

            await environment.stop();
        }

        this._flight.recorder.conclude();
    }

    private async runScenario(scenario: Scenario, environment: ScenarioEnvironment): Promise<ScenarioResult> {
        this._flight.scenario.next(scenario);
        await scenario.instance.context?.establish(environment);

        const specificationResult = await this._specificationRunner.run(scenario.instance, scenario.specification);
        return new ScenarioResult(scenario, specificationResult);
    }

    private async recordScenario(scenarioResult: ScenarioResult, scenario: Scenario, environment: ScenarioEnvironment) {
        await this._flight.recorder.resultsFor(scenarioResult);
        await this._flight.recorder.captureMetricsFor(scenario);
        await environment.dumpEventStore(scenario);
    }

    private async cleanupAfterScenario(scenario: Scenario, environment: ScenarioEnvironment) {
        this._flight.scenario.next(Scenario.none);
        await environment.forEachMicroservice(microservice => microservice.eventStore.clear());
        await scenario.instance.context?.cleanup();
    }
}
