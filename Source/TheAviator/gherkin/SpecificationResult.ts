// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Specification } from './Specification';
import { ThenResult } from './ThenResult';

export class SpecificationResult {
    readonly specification: Specification;
    readonly results: ThenResult[];

    constructor(specification: Specification, results: ThenResult[]) {
        this.specification = specification;
        this.results = results;
    }
}
