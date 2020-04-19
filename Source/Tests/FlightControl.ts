// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IFlightRecorder } from './IFlightRecorder';
import { FlightPlan } from './FlightPlan';
import { Flight } from './Flight';
import { IFlightControl } from './IFlightControl';
import { ScenarioSubject } from './rules/ScenarioSubject';
import { Microservice } from './Microservice';
import { ScenarioContext } from './ScenarioContext';

type MicroserviceMethod = (microservice: Microservice) => Promise<void>;

export class FlightControl implements IFlightControl {
    constructor(private _flightRecorder: IFlightRecorder) {
    }

    async takeOffWith(flightPlan: FlightPlan): Promise<Flight> {
        const flight = new Flight(flightPlan);

        for (const [context, scenarios] of flightPlan.scenariosByContexts) {
            await context.prepare();
        }

        this._flightRecorder.recordFor(flight);

        for (const [context, scenarios] of flightPlan.scenariosByContexts) {
            this.performOnMicroservice(context, (microservice) => microservice.start());

            for (const scenario of scenarios) {
                await this.performOnMicroservice(context, async (microservice) => await microservice.beginEvaluation());

                this._flightRecorder.setCurrentScenario(scenario);
                scenario.setContext(context);
                await scenario.when();
                await scenario.then();

                await this.performOnMicroservice(context, async (microservice) => {
                    await microservice.endEvaluation();
                    if (microservice.eventLogEvaluation) {
                        this._flightRecorder.reportResultFor(flight, scenario, microservice, microservice.eventLogEvaluation);
                    }
                });
            }

            await this.performOnMicroservice(context, async (microservice) => await microservice.kill());
        }

        return flight;
    }

    private async performOnMicroservice(context: ScenarioContext, method: MicroserviceMethod) {
        for (const microservice of context.microservices.values()) {
            await method(microservice);
        }
    }
}
