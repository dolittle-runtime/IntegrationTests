// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import fs from 'fs';
import path from 'path';

import { Flight } from './Flight';
import { IFlightControl } from './IFlightControl';

import { Microservice, IMicroserviceFactory } from '../microservices';

import { ScenarioContext, ScenarioContextDefinition, Scenario } from '../gherkin';

type MicroserviceMethod = (microservice: Microservice) => Promise<void>;

export class FlightControl implements IFlightControl {
    constructor(private _flight: Flight, private _microserviceFactory: IMicroserviceFactory) {
    }

    async takeOff(): Promise<void> {
        for (const [contextDefinition, scenarios] of this._flight.plan.scenariosByContexts) {
            const microservicesByName = await this.prepareMicroservicesFor(contextDefinition);
            const microservices = Object.values(microservicesByName);
            const context = new ScenarioContext(contextDefinition, microservicesByName);

            this._flight.recorder.writeConfigurationFilesFor(microservices);
            this._flight.recorder.collectLogsFor(microservices);

            this._flight.scenarioContext.next(context);

            await this.performOnMicroservice(microservices, async (microservice) => await microservice.start());
            await this.connectConsumersToProducers(microservices, contextDefinition);

            for (const scenario of scenarios) {
                scenario.setContext(context);

                await this.performOnMicroservice(microservices, async (microservice) => await microservice.beginEvaluation());

                this._flight.scenario.next(scenario);

                await scenario.when();
                await scenario.then();

                await this.performOnMicroservice(microservices, async (microservice) => {
                    const brokenRules = await microservice.endEvaluation();
                    scenario.handleBrokenRules(brokenRules);
                    await this._flight.recorder.reportResultFor(scenario, microservice);
                    await this.dumpEventStore(microservice, scenario);
                    await microservice.eventStore.clear();
                    await microservice.head.restart();
                });
            }

            await this.disconnectConsumersFromProducers(microservices, contextDefinition);

            await this.performOnMicroservice(microservices, async (microservice) => { await microservice.kill(); });
        }

        this._flight.recorder.conclude();
    }

    private async dumpEventStore(microservice: Microservice, scenario: Scenario) {
        if (scenario.context) {
            const backups = await microservice.eventStore.dump();
            const sourceDirectory = this._flight.paths.forMicroserviceInContext(scenario.context.definition, microservice);
            const backupDirectory = path.join(sourceDirectory, 'backup');
            for (const backup of backups) {
                const tenantId = backup.split(' ')[1];
                const microserviceDestinationDirectory = this._flight.paths.forMicroservice(scenario, microservice);
                const destinationDirectory = path.join(microserviceDestinationDirectory, 'eventStore');
                if (!fs.existsSync(destinationDirectory)) {
                    fs.mkdirSync(destinationDirectory, { recursive: true });
                }
                const sourceFile = path.join(backupDirectory, backup);
                const destinationFile = path.join(destinationDirectory, tenantId);
                fs.renameSync(sourceFile, destinationFile);
            }
        }
    }

    private async prepareMicroservicesFor(context: ScenarioContextDefinition) {
        const microservicesByName: { [key: string]: Microservice } = {};

        for (const microservice of context.microservices) {
            const workingDirectory = this._flight.paths.forScenarioContext(context);
            const microserviceInstance = await this._microserviceFactory?.create(this._flight.platform, workingDirectory, microservice);
            if (microserviceInstance) {
                microservicesByName[microservice.name] = microserviceInstance;
            }
        }

        return microservicesByName;
    }

    private async connectConsumersToProducers(microservices: Microservice[], contextDefinition: ScenarioContextDefinition) {
        for (const consumerName of Object.keys(contextDefinition.consumerToProducerMap)) {
            const consumer = microservices.find(_ => _.configuration.name === consumerName);
            if (consumer) {
                for (const producerDefinition of contextDefinition.consumerToProducerMap[consumerName]) {
                    const producer = microservices.find(_ => _.configuration.name === producerDefinition.name);
                    if (producer) {
                        await consumer.connectToProducer(producer);
                    }
                }
            }
        }
    }

    private async disconnectConsumersFromProducers(microservices: Microservice[], contextDefinition: ScenarioContextDefinition) {
        for (const consumerName of Object.keys(contextDefinition.consumerToProducerMap)) {
            const consumer = microservices.find(_ => _.configuration.name === consumerName);
            if (consumer) {
                for (const producerDefinition of contextDefinition.consumerToProducerMap[consumerName]) {
                    const producer = microservices.find(_ => _.configuration.name === producerDefinition.name);
                    if (producer) {
                        await consumer.disconnectFromProducer(producer);
                    }
                }
            }
        }
    }


    private async performOnMicroservice(microservices: Microservice[], method: MicroserviceMethod) {
        for (const microservice of microservices.values()) {
            await method(microservice);
        }
    }
}
