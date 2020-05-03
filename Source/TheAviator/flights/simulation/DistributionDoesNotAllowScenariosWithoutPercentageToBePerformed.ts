// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export class DistributionDoesNotAllowScenariosWithoutPercentageToBePerformed extends Error {
    constructor(procedure: any) {
        super(`The procedure '${procedure.constructor.name}' has scenarios without percentage that won't be performed due to sum of scenarios with percentage being 100.`);
    }
}
