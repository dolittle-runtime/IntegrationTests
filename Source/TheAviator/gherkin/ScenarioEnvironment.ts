// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import fs from 'fs';
import path from 'path';
import { retry } from 'async';

import { Microservice } from '../microservices';
import { ScenarioEnvironmentDefinition } from './ScenarioEnvironmentDefinition';
import { IFlightPaths } from '../flights';
import { Scenario } from './Scenario';
import { IContainer } from '../containers';
import { ISerializer } from '../ISerializer';

export type MicroserviceMethod = (microservice: Microservice) => Promise<void>;

export class ScenarioEnvironment {
    static empty: ScenarioEnvironment = new ScenarioEnvironment({} as IFlightPaths, new ScenarioEnvironmentDefinition(), {}, {} as ISerializer);

    readonly definition: ScenarioEnvironmentDefinition;
    readonly microservices: { [key: string]: Microservice };

    constructor(
        private _flightPaths: IFlightPaths,
        definition: ScenarioEnvironmentDefinition,
        microservices: { [key: string]: Microservice },
        readonly _serializer: ISerializer) {
        this.definition = definition;
        this.microservices = microservices;
        this.writeConfigurationFiles();
    }

    async start(): Promise<void> {
        await this.forEachMicroservice(async _ => await _.start());
        await this.connectConsumersToProducers();
    }

    async stop(): Promise<void> {
        await this.disconnectConsumersFromProducers();
        await this.forEachMicroservice(async _ => await _.kill());
    }

    async forEachMicroservice(method: MicroserviceMethod) {
        for (const microservice of Object.values(this.microservices)) {
            await method(microservice);
        }
    }

    async dumpEventStore(scenario: Scenario) {
        this.forEachMicroservice(async (microservice) => {
            const microserviceDestinationDirectory = this._flightPaths.forMicroserviceInScenario(scenario, microservice);
            const destinationDirectory = path.join(microserviceDestinationDirectory, 'eventStore');

            if (!fs.existsSync(destinationDirectory)) {
                fs.mkdirSync(destinationDirectory, { recursive: true });
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
                const containerOptionsFile = path.join(microservicePath, `${container.options.friendlyName}.json`);
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
