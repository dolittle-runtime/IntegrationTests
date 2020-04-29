// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export class ThenIsNotAMethod extends Error {
    constructor(name: string, owningType: string) {
        super(`Property '${name}' on '${owningType}' is not a method`);
    }
}
