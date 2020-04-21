// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Flight } from './Flight';
import { IFlightControl } from './IFlightControl';

import { Microservice, IMicroserviceFactory } from '../microservices';

import { ScenarioContext } from '../gherkin';

type MicroserviceMethod = (microservice: Microservice) => Promise<void>;

export class FlightControl implements IFlightControl {
    constructor(private _flight: Flight, private _microserviceFactory: IMicroserviceFactory) {
    }

    async takeOff(): Promise<void> {
        for (const [context, scenarios] of this._flight.plan.scenariosByContexts) {
            await context.prepare();
            await this.performOnMicroservice(context, async (microservice) => await microservice.start());

            for (const scenario of scenarios) {
                await this.performOnMicroservice(context, async (microservice) => await microservice.beginEvaluation());

                this._flight.recorder.setCurrentScenario(scenario);

                scenario.setContext(context);
                await scenario.when();
                await scenario.then();

                await this.performOnMicroservice(context, async (microservice) => {
                    await microservice.endEvaluation();
                    if (microservice.eventLogEvaluation) {
                        await this._flight.recorder.reportResultFor(scenario, microservice, microservice.eventLogEvaluation);
                    }
                });

                await this.performOnMicroservice(context, async (microservice) => await microservice.clearEventStore());
            }

            await this.performOnMicroservice(context, async (microservice) => {
                await microservice.kill();
                await this._microserviceFactory.cleanupAfter(microservice);
            });
        }

        this._flight.recorder.conclude();
    }

    private async performOnMicroservice(context: ScenarioContext, method: MicroserviceMethod) {
        for (const microservice of context.microservices.values()) {
            await method(microservice);
        }
    }
}
