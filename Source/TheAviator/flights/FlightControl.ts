// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as util from 'util';
const asyncTimeout = util.promisify(setTimeout);

import { Flight } from './Flight';
import { IFlightControl } from './IFlightControl';
import { Microservice } from '../microservices/Microservice';
import { ScenarioContext } from '../gherkin/ScenarioContext';
import { IMicroserviceFactory } from '../microservices/IMicroserviceFactory';

type MicroserviceMethod = (microservice: Microservice) => Promise<void>;

export class FlightControl implements IFlightControl {
    constructor(private _flight: Flight, private _microserviceFactory: IMicroserviceFactory) {
    }

    async takeOff(): Promise<void> {
        console.log('takeOff');

        for (const [context, scenarios] of this._flight.plan.scenariosByContexts) {
            console.log('prepare context');
            await context.prepare();
            console.log('context prepared');
        }

        console.log('Run through scenarios, context by context');
        for (const [context, scenarios] of this._flight.plan.scenariosByContexts) {
            this._flight.recorder.setCurrentScenarioContext(context);
            await this.performOnMicroservice(context, async (microservice) => await microservice.start());

            for (const scenario of scenarios) {
                console.log(`Begin scenario ${scenario.name}`);
                await this.performOnMicroservice(context, async (microservice) => await microservice.beginEvaluation());

                this._flight.recorder.setCurrentScenario(scenario);

                console.log('Given');
                scenario.setContext(context);

                console.log('When');
                await scenario.when();

                console.log('Then');
                await scenario.then();

                console.log('Report results');

                await this.performOnMicroservice(context, async (microservice) => {
                    console.log('End evaluation');
                    await microservice.endEvaluation();
                    if (microservice.eventLogEvaluation) {
                        console.log('Talk to flight recorder for reporting');
                        await this._flight.recorder.reportResultFor(scenario, microservice, microservice.eventLogEvaluation);
                        console.log('Reported');
                    }
                });

                console.log('Clear event store');
                await this.performOnMicroservice(context, async (microservice) => await microservice.clearEventStore());
            }

            console.log('Kill microservice');
            await this.performOnMicroservice(context, async (microservice) => {
                await microservice.kill();
                await this._microserviceFactory.cleanupAfter(microservice);
            });
        }

        console.log('Conclude');
        this._flight.recorder.conclude();
    }

    private async performOnMicroservice(context: ScenarioContext, method: MicroserviceMethod) {
        for (const microservice of context.microservices.values()) {
            await method(microservice);
        }
    }
}
