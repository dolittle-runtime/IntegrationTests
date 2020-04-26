// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { FailedRule } from '../flights/FailedRule';

export class ScenarioResult {
    readonly name: string;
    readonly context: string;
    readonly thens: { [key: string]: FailedRule[] };

    constructor(name: string, context: string, thens: { [key: string]: FailedRule[] }) {
        this.name = name;
        this.context = context;
        this.thens = thens;
    }
}
