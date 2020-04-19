// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export class When {
    readonly name: string;
    readonly ands: string[];

    constructor(name: string) {
        this.name = name;
        this.ands = [];
    }

    addAnds(name: string) {
        this.ands.push(name);
    }
}
