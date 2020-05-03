// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export class TotalPercentageDoesNotAddUp extends Error {
    constructor(procedure: any) {
        super(`The procedure '${procedure.constructor.name}' exceeds the total percentage of 100.`);
    }
}
