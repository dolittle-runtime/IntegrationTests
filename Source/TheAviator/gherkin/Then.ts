// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { BrokenRule } from '@dolittle/rules';

export class Then {
    readonly name: string;
    readonly method: Function;
    _brokenRules: BrokenRule[] = [];

    constructor(name: string, method: Function) {
        this.name = name;
        this.method = method;
    }

    get brokenRules(): BrokenRule[] {
        return this._brokenRules;
    }

    addBrokenRules(brokenRules: BrokenRule[]) {
        this._brokenRules = this._brokenRules.concat(brokenRules);
    }
}
