// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { FailedRule } from '../FailedRule';

export class ScenarioResult {
    readonly name: string;
    readonly context: string;
    readonly failedRules: FailedRule[];

    constructor(name: string, context: string, failedRules: FailedRule[]) {
        this.name = name;
        this.context = context;
        this.failedRules = failedRules;
    }
}
