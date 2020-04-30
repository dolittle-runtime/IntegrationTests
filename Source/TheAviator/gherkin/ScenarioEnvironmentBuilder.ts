// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IScenarioEnvironmentBuilder } from './IScenarioEnvironmentBuilder';
import { ScenarioEnvironmentDefinition } from './ScenarioEnvironmentDefinition';
import { ScenarioEnvironment } from './ScenarioEnvironment';
import { IMicroserviceFactory } from 'microservices';

export class ScenarioEnvironmentBuilder implements IScenarioEnvironmentBuilder {
    constructor(private _microserviceFactory: IMicroserviceFactory) {

    }

    buildFrom(definition: ScenarioEnvironmentDefinition): ScenarioEnvironment {
        throw new Error('Method not implemented.');
    }
}
