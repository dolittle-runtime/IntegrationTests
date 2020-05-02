// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioFor } from './ScenarioFor';
import { ScenarioContext } from './ScenarioContext';

export class Then {
    readonly name: string;
    readonly method: Function;

    constructor(name: string, method: Function) {
        this.name = name;
        this.method = method;
    }

    async invoke(scenarioFor: ScenarioFor<ScenarioContext>): Promise<void> {
        await this.method.apply(scenarioFor);
    }
}
