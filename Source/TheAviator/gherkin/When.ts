// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { BehaviorSubject } from 'rxjs';

export class When {
    readonly name: string;
    readonly ands: BehaviorSubject<string[]>;

    constructor(name: string) {
        this.name = name;
        this.ands = new BehaviorSubject<string[]>([]);
    }

    addAnds(name: string) {
        this.ands.value.push(name);
    }
}
