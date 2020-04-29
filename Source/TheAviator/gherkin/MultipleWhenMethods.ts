// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export class MultipleWhenMethods extends Error {
    constructor(owningType: string) {
        super(`Found multiple 'when' methods on '${owningType}'. There can only be one (Highlander principle).`);
    }
}
