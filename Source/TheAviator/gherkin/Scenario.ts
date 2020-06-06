// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import humanReadable from '../humanReadable';
import { ScenarioEnvironment } from './ScenarioEnvironment';
import { Specification } from './Specification';
import { ScenarioFor } from './ScenarioFor';
import { ScenarioContext } from './ScenarioContext';
import { ScenarioEnvironmentDefinition } from './ScenarioEnvironmentDefinition';

class no_context extends ScenarioContext {
    async describe(environment: ScenarioEnvironmentDefinition): Promise<void> {
    }
    async cleanup(): Promise<void> {
    }
}
class no_scenario extends ScenarioFor<no_context> {
    for = no_context;
}

export class Scenario {

    static none: Scenario = new Scenario(new no_scenario(), ScenarioEnvironment.empty, Specification.empty);

    readonly name: string;
    readonly contextName: string;
    readonly instance: ScenarioFor<ScenarioContext>;
    readonly environment: ScenarioEnvironment;
    readonly specification: Specification;

    constructor(instance: ScenarioFor<ScenarioContext>, environment: ScenarioEnvironment, specification: Specification) {
        this.name = humanReadable(instance.constructor.name);
        this.contextName = humanReadable(instance.for.name);
        this.instance = instance;
        this.environment = environment;
        this.specification = specification;
    }
}
