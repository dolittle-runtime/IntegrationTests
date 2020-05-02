// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IScenarioEnvironmentBuilder } from './IScenarioEnvironmentBuilder';
import { ScenarioEnvironmentDefinition } from './ScenarioEnvironmentDefinition';
import { ScenarioEnvironment } from './ScenarioEnvironment';
import { IMicroserviceFactory, MicroserviceConfiguration, Microservice } from '../microservices';

export class ScenarioEnvironmentBuilder implements IScenarioEnvironmentBuilder {
    constructor(private _microserviceFactory: IMicroserviceFactory) {

    }

    async buildFrom(platform: string, workingDirectory: string, definition: ScenarioEnvironmentDefinition): Promise<ScenarioEnvironment> {
        const microservices: { [key: string]: Microservice } = {};

        for (const microserviceDefinition of definition.microservices) {
            const configuration = MicroserviceConfiguration.from(platform, microserviceDefinition);

            const microservice = await this._microserviceFactory.create(workingDirectory, configuration);
            microservices[microserviceDefinition.name] = microservice;
        }

        return new ScenarioEnvironment(definition, microservices);
    }
}
