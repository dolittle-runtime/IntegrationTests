// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export class BecauseOf {
    static nothing: BecauseOf = { name: 'nothing', method: () => { } };

    readonly name!: string;
    readonly method!: Function;
}
