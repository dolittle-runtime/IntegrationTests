// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import fs from 'fs';
import path from 'path';
import { retry } from 'async';

import { Flight } from './Flight';
import { IFlightInspection } from './IFlightInspection';

import { Microservice, IMicroserviceFactory, MicroserviceConfiguration } from '../microservices';

import { ScenarioEnvironment, ScenarioEnvironmentDefinition, Scenario } from '../gherkin';

type MicroserviceMethod = (microservice: Microservice) => Promise<void>;

export class FlightInspection implements IFlightInspection {
    constructor(private _flight: Flight, private _microserviceFactory: IMicroserviceFactory) {
    }

    async runPreflightCheck(): Promise<void> {
        for (const [contextDefinition, scenarios] of this._flight.preflightChecklist.scenariosByEnvironment) {
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

    private async dumpEventStore(microservice: Microservice, scenario: Scenario) {
        if (scenario.environment) {
            const backups = await microservice.eventStore.dump();
            const sourceDirectory = this._flight.paths.forMicroserviceInContext(scenario.environment.definition, microservice);
            const backupDirectory = path.join(sourceDirectory, 'backup');
            for (const backup of backups) {
                const tenantId = backup.split(' ')[1];
                const microserviceDestinationDirectory = this._flight.paths.forMicroservice(scenario, microservice);
                const destinationDirectory = path.join(microserviceDestinationDirectory, 'eventStore');

                if (!fs.existsSync(destinationDirectory)) {
                    fs.mkdirSync(destinationDirectory, { recursive: true });
                }

                const sourceFile = path.join(backupDirectory, backup);
                const destinationFile = path.join(destinationDirectory, `backup-for-tenant-${tenantId}`);

                try {
                    await retry({ times: 5, interval: 200 }, async (callback, results) => {
                        if (!fs.existsSync(sourceFile)) {
                            callback(new Error('Backup file not there yet'));
                        } else {
                            fs.renameSync(sourceFile, destinationFile);
                            callback(null);
                        }
                    });
                } catch (ex) {
                    console.log(`Couldn't copy backup file '${sourceFile}' - reason: '${ex}'`);
                }
            }
        }
    }

    private async prepareMicroservicesFor(context: ScenarioEnvironmentDefinition): Promise<{ [key: string]: Microservice }> {
        const microservicesByName: { [key: string]: Microservice } = {};
        const microserviceConfigurations = this.prepareMicroserviceConfigurations(context);

        for (const microserviceConfiguration of microserviceConfigurations) {
            // const workingDirectory = this._flight.paths.forScenarioContext(context);
            // const microserviceInstance = await this._microserviceFactory?.create(this._flight.platform, workingDirectory, microserviceConfiguration);
            // if (microserviceInstance) {
            //     microservicesByName[microserviceConfiguration.name] = microserviceInstance;
            // }
        }

        return microservicesByName;
    }

    private prepareMicroserviceConfigurations(context: ScenarioEnvironmentDefinition): MicroserviceConfiguration[] {
        const microserviceConfigurations: MicroserviceConfiguration[] = [];
        for (const microserviceDefinition of context.microservices) {
            microserviceConfigurations.push(MicroserviceConfiguration.from(this._flight.platform, microserviceDefinition));
        }

        for (const consumerDefinition of context.microservices) {
            const consumer = microserviceConfigurations.find(_ => _.name === consumerDefinition.name);
            if (consumer) {
                for (const producerDefinition of consumerDefinition.producers) {
                    const producer = microserviceConfigurations.find(_ => _.name === producerDefinition.name);
                    if (producer) {
                        consumer.addProducer(producer);
                    }
                }
            }
        }

        return microserviceConfigurations;
    }

    private async connectConsumersToProducers(microservices: Microservice[], contextDefinition: ScenarioEnvironmentDefinition) {
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

    private async disconnectConsumersFromProducers(microservices: Microservice[], contextDefinition: ScenarioEnvironmentDefinition) {
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
