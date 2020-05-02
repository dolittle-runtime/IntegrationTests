// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IScenarioEnvironmentBuilder } from './IScenarioEnvironmentBuilder';
import { ScenarioEnvironmentDefinition } from './ScenarioEnvironmentDefinition';
import { ScenarioEnvironment } from './ScenarioEnvironment';
import { IMicroserviceFactory, MicroserviceConfiguration, Microservice } from '../microservices';
import { IFlightPaths } from '../flights';
import { ISerializer } from '../ISerializer';

export class ScenarioEnvironmentBuilder implements IScenarioEnvironmentBuilder {
    constructor(
        private _flightPaths: IFlightPaths,
        private _microserviceFactory: IMicroserviceFactory,
        private _serializer: ISerializer) {

    }

    async buildFrom(platform: string, definition: ScenarioEnvironmentDefinition): Promise<ScenarioEnvironment> {
        const microservices: { [key: string]: Microservice } = {};

        const configurations = this.prepareMicroserviceConfigurations(platform, definition);
        for (const configuration of configurations) {
            const workingDirectory = this._flightPaths.base;
            const microservice = await this._microserviceFactory.create(workingDirectory, configuration);
            microservices[configuration.name] = microservice;
        }

        return new ScenarioEnvironment(this._flightPaths, definition, microservices, this._serializer);
    }


    private prepareMicroserviceConfigurations(platform: string, definition: ScenarioEnvironmentDefinition): MicroserviceConfiguration[] {
        const microserviceConfigurations: MicroserviceConfiguration[] = [];
        for (const microserviceDefinition of definition.microservices) {
            microserviceConfigurations.push(MicroserviceConfiguration.from(platform, microserviceDefinition));
        }

        for (const consumerDefinition of definition.microservices) {
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
}
