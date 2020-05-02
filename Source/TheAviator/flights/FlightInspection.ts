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

            await environment.connectConsumersToProducers();

            for (const scenario of scenarios) {
                this._flight.scenario.next(scenario);
                await scenario.instance.context?.establish(environment);

                const specificationResult = await this._specificationRunner.run(scenario.instance, scenario.specification);
                const scenarioResult = new ScenarioResult(scenario, specificationResult);

                await this._flight.recorder.reportResultFor(scenarioResult);
                await this._flight.recorder.captureMetricsFor(scenario);
                await environment.dumpEventStore(scenario);
            }

            await environment.disconnectConsumersFromProducers();

            environment.stop();


            // const microservicesByName = await this.prepareMicroservicesFor(contextDefinition);
            // const microservices = Object.values(microservicesByName);
            // const context = new ScenarioEnvironment(contextDefinition, microservicesByName);

            // this._flight.recorder.writeConfigurationFilesFor(microservices);
            // this._flight.recorder.collectLogsFor(microservices);

            // this._flight.scenarioContext.next(context);

            // await this.performOnMicroservice(microservices, async (microservice) => await microservice.start());
            // await this.connectConsumersToProducers(microservices, contextDefinition);

            // for (const scenario of scenarios) {
            //     //scenario.setContext(context);

            //     this._flight.scenario.next(scenario);

            //     /*
            //     await scenario.establish();
            //     await scenario.when();
            //     await scenario.then();
            //     */

            //     await this.performOnMicroservice(microservices, async (microservice) => {
            //         //const brokenRules = await microservice.endEvaluation();
            //         //scenario.handleBrokenRules(brokenRules);
            //     });
            //     await this._flight.recorder.reportResultFor(scenario);

            //     await this.performOnMicroservice(microservices, async (microservice) => {
            //         await this._flight.recorder.captureMetricsFor(scenario, microservice);
            //         await this.dumpEventStore(microservice, scenario);
            //         await microservice.eventStore.clear();
            //         await microservice.head.restart();
            //     });
            // }

            // await this.disconnectConsumersFromProducers(microservices, contextDefinition);

            // await this.performOnMicroservice(microservices, async (microservice) => { await microservice.kill(); });
        }

        this._flight.recorder.conclude();
    }

}
