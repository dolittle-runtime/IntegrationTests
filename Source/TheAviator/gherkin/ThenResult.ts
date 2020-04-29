// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { BrokenRule } from '@dolittle/rules';
import { Then } from './Then';

export class ThenResult {
    readonly then: Then;
    readonly brokenRules: BrokenRule[];

    constructor(then: Then, brokenRules: BrokenRule[]) {
        this.then = then;
        this.brokenRules = brokenRules;
    }
}
