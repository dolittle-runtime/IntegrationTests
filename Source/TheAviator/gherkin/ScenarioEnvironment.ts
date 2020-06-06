// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { Microservice } from '../microservices';
import { ScenarioEnvironmentDefinition } from './ScenarioEnvironmentDefinition';
import { IFlightPaths } from '../flights';
import { Scenario } from './Scenario';
import { IContainer } from '../containers';
import { ISerializer } from '../ISerializer';

const eventStoreDumpFolderName = 'eventStore';
const containerOptionsFileExtension = '.json';

export type MicroserviceAction = (microservice: Microservice) => Promise<void>;

export class ScenarioEnvironment {

    /**
     * Gets an empty {ScenarioEnvironment}
     *
     * @static
     * @type {ScenarioEnvironment}
     */
    static readonly empty: ScenarioEnvironment = new ScenarioEnvironment(
        {} as IFlightPaths,
        new ScenarioEnvironmentDefinition(),
        {},
        {} as ISerializer);

    constructor(
        private readonly _flightPaths: IFlightPaths,
        readonly definition: ScenarioEnvironmentDefinition,
        readonly microservices: { [key: string]: Microservice },
        readonly _serializer: ISerializer) {
        this.writeConfigurationFiles();
    }

    async start(): Promise<void> {
        await this.forEachMicroservice(_ => _.start());
        await this.connectConsumersToProducers();
    }

    async stop(): Promise<void> {
        await this.disconnectConsumersFromProducers();
        await this.forEachMicroservice(_ => _.kill());
    }

    forEachMicroservice(action: MicroserviceAction): Promise<void[]> {
        const promises: Promise<void>[] = [];
        for (const microservice of Object.values(this.microservices)) {
            promises.push(action(microservice));
        }
        return Promise.all(promises);
    }

    async dumpEventStore(scenario: Scenario) {
        this.forEachMicroservice(async (microservice) => {
            const microserviceDestinationDirectory = this._flightPaths.forMicroserviceInScenario(scenario, microservice);
            const destinationDirectory = path.join(microserviceDestinationDirectory, eventStoreDumpFolderName);
            const directoryExists = await promisify(fs.exists)(destinationDirectory);
            if (!directoryExists) {
                await promisify(fs.mkdir)(destinationDirectory, { recursive: true });
            }

            await microservice.eventStore.dump(destinationDirectory);
        });
    }

    private async connectConsumersToProducers() {
        for (const consumerName of Object.keys(this.definition.consumerToProducerMap)) {
            const consumer = this.microservices[consumerName];
            if (consumer) {
                for (const producerDefinition of this.definition.consumerToProducerMap[consumerName]) {
                    const producer = this.microservices[producerDefinition.name];
                    if (producer) {
                        await consumer.connectToProducer(producer);
                    }
                }
            }
        }
    }

    private async disconnectConsumersFromProducers() {
        for (const consumerName of Object.keys(this.definition.consumerToProducerMap)) {
            const consumer = this.microservices[consumerName];
            if (consumer) {
                for (const producerDefinition of this.definition.consumerToProducerMap[consumerName]) {
                    const producer = this.microservices[producerDefinition.name];
                    if (producer) {
                        await consumer.disconnectFromProducer(producer);
                    }
                }
            }
        }
    }

    private writeConfigurationFiles() {
        for (const microservice of Object.values(this.microservices)) {
            const microservicePath = this._flightPaths.forMicroservice(microservice);

            const writeOptionsFile = (container: IContainer) => {
                const containerOptionsFile = path.join(microservicePath, `${container.options.friendlyName}${containerOptionsFileExtension}`);
                const configOutput = JSON.parse(JSON.stringify(container.options));

                configOutput.boundPorts = {};
                for (const [k, v] of container.boundPorts) {
                    configOutput.boundPorts[k] = v;
                }
                fs.writeFileSync(containerOptionsFile, this._serializer.toJSON(configOutput));
            };

            writeOptionsFile(microservice.head);
            writeOptionsFile(microservice.runtime);
            writeOptionsFile(microservice.eventStoreStorage);
        }
    }
}
