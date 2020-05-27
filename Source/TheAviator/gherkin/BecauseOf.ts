// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioFor } from './ScenarioFor';
import { ScenarioContext } from './ScenarioContext';
import { RunStatus } from './RunStatus';

export class BecauseOf {
    static nothing: BecauseOf = new BecauseOf('nothing', () => { });

    readonly name: string;
    readonly method: Function;
    readonly status: RunStatus;

    constructor(name: string, method: Function) {
        this.name = name;
        this.method = method;
        this.status = new RunStatus();
    }

    async invoke(scenarioFor: ScenarioFor<ScenarioContext>): Promise<void> {
        this.status.running();
        await this.method.apply(scenarioFor);
        this.status.completed();
    }
}

