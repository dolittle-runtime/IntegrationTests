// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export class MissingWhenMethod extends Error {
    constructor(owningType: string) {
        super(`Missing 'when' methods on '${owningType}'. Expected method starting with 'when_'.`);
    }
}
