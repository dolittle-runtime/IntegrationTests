// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { BehaviorSubject } from 'rxjs';
import { BecauseOf } from './BecauseOf';

export class When {
    readonly becauseOf: BecauseOf;
    readonly ands: BehaviorSubject<BecauseOf[]>;

    constructor(becauseOf: BecauseOf) {
        this.becauseOf = becauseOf;
        this.ands = new BehaviorSubject<BecauseOf[]>([]);
    }

    addAnd(becauseOf: BecauseOf) {
        this.ands.value.push(name);
    }
}
