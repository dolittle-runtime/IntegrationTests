// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export class Then {
    readonly name: string;
    readonly method: Function;

    constructor(name: string, method: Function) {
        this.name = name;
        this.method = method;
    }
}
