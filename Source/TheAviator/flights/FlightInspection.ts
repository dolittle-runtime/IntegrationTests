// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.


import { Flight } from './Flight';
import { IFlightInspection } from './IFlightInspection';
import { ISpecificationRunner, ScenarioResult } from '../gherkin';

export class FlightInspection implements IFlightInspection {
    constructor(private _flight: Flight, private _specificationRunner: ISpecificationRunner) {
    }

    async runPreflightCheck(): Promise<void> {
        for (const [environment, scenarios] of this._flight.preflightChecklist.scenariosByEnvironment) {
            this._flight.environment.next(environment);

            await environment.start();

            for (const scenario of scenarios) {
                this._flight.scenario.next(scenario);
                await scenario.instance.context?.establish(environment);

                const specificationResult = await this._specificationRunner.run(scenario.instance, scenario.specification);
                const scenarioResult = new ScenarioResult(scenario, specificationResult);

                await this._flight.recorder.resultsFor(scenarioResult);
                await this._flight.recorder.captureMetricsFor(scenario);
                await environment.dumpEventStore(scenario);
            }

            await environment.stop();
        }

        this._flight.recorder.conclude();
    }
}
