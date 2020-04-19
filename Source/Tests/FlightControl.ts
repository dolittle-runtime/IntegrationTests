// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IFlightRecorder } from './IFlightRecorder';
import { FlightPlan } from './FlightPlan';
import { Flight } from './Flight';
import { IFlightControl } from './IFlightControl';

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
            for (const microservice of context.microservices.values()) {
                await microservice.start();
            }

            for (const scenario of scenarios) {
                this._flightRecorder.setCurrentScenario(scenario);
                await scenario.when();
                await scenario.then();
            }

            for (const microservice of context.microservices.values()) {
                await microservice.evaluateRules();
            }

            for (const microservice of context.microservices.values()) {
                await microservice.kill();
            }
        }

        return flight;
    }
}
