// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioEnvironment } from './ScenarioEnvironment';
import { Specification } from './Specification';
import { Constructor } from 'Constructor';
import humanReadable from '../humanReadable';

export class Scenario {
    static none: Scenario = new Scenario(Scenario, ScenarioEnvironment.empty, Specification.empty);

    readonly name: string;
    readonly owner: Constructor<any>;
    readonly context: ScenarioEnvironment;
    readonly specification: Specification;

    constructor(owner: Constructor<any>, environment: ScenarioEnvironment, specification: Specification) {
        if (owner === Scenario) {
            this.name = 'no scenario';
        } else {
            this.name = humanReadable(owner.name);
        }
        this.owner = owner;
        this.context = environment;
        this.specification = specification;
    }
}
