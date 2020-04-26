// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { FailedRuleCause } from './FailedRuleCause';

export class FailedRule {
    readonly name: string;
    readonly causes: FailedRuleCause[];

    constructor(name: string, causes: FailedRuleCause[]) {
        this.name = name;
        this.causes = causes;
    }
}
