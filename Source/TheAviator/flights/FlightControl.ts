// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Flight } from './Flight';
import { IFlightControl } from './IFlightControl';

import { Microservice, IMicroserviceFactory } from '../microservices';

import { ScenarioContext, ScenarioContextDefinition } from '../gherkin';

type MicroserviceMethod = (microservice: Microservice) => Promise<void>;

export class FlightControl implements IFlightControl {
    constructor(private _flight: Flight, private _microserviceFactory: IMicroserviceFactory) {
    }

    async takeOff(): Promise<void> {
        for (const [contextDefinition, scenarios] of this._flight.plan.scenariosByContexts) {
            const microservicesByName = await this.prepareMicroservicesFor(contextDefinition);
            const microservices = Object.values(microservicesByName);
            const context = new ScenarioContext(contextDefinition.name, microservicesByName);

            this._flight.recorder.writeConfigurationFilesFor(microservices);
            this._flight.recorder.collectLogsFor(microservices);

            this._flight.scenarioContext.next(context);

            await this.performOnMicroservice(microservices, async (microservice) => await microservice.start());

            for (const scenario of scenarios) {
                scenario.setContext(context);

                await this.performOnMicroservice(microservices, async (microservice) => await microservice.beginEvaluation());

                this._flight.scenario.next(scenario);

                await scenario.when();
                await scenario.then();

                await this.performOnMicroservice(microservices, async (microservice) => {
                    const brokenRules = await microservice.endEvaluation();
                    await this._flight.recorder.reportResultFor(scenario, microservice, brokenRules);
                    await microservice.eventStore.dump();
                    await microservice.eventStore.clear();
                });
            }

            await this.performOnMicroservice(microservices, async (microservice) => { await microservice.kill(); });
        }

        console.log('Conclude');

        this._flight.recorder.conclude();
        console.log('Concluded');
    }

    private async prepareMicroservicesFor(context: ScenarioContextDefinition) {
        const microservicesByName: { [key: string]: Microservice } = {};

        for (const microservice of context.microservices) {
            const workingDirectory = this._flight.paths.forScenarioContext(context);
            const microserviceInstance = await this._microserviceFactory?.create(this._flight.platform, microservice.name, microservice.tenants, workingDirectory);
            if (microserviceInstance) {
                microservicesByName[microservice.name] = microserviceInstance;
            }
        }

        return microservicesByName;
    }

    private async performOnMicroservice(microservices: Microservice[], method: MicroserviceMethod) {
        for (const microservice of microservices.values()) {
            await method(microservice);
        }
    }
}
