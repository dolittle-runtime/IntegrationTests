// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioFor, ScenarioContext, Specification, ScenarioEnvironment, Scenario } from '../../gherkin';
import { Constructor } from '@dolittle/rudiments';

export class ScenarioForSimulation {
    readonly type: Constructor<ScenarioFor<ScenarioContext>>;
    readonly environment: ScenarioEnvironment;
    readonly specification: Specification;

    constructor(type: Constructor<ScenarioFor<ScenarioContext>>, environment: ScenarioEnvironment, specification: Specification) {
        this.type = type;
        this.environment = environment;
        this.specification = specification;
    }

    getInstance(): Scenario {
        const instance = new this.type();
        instance.context = new instance.for();
        instance.context?.establish(this.environment);
        return new Scenario(instance, this.environment, this.specification);
    }
}
