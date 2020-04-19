// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export class FailedRule {
    readonly name: string;
    readonly message: string;
    readonly thenMethod: string;

    constructor(name: string, message: string, thenMethod: string) {
        this.name = name;
        this.message = message;
        this.thenMethod = thenMethod;
    }
}
