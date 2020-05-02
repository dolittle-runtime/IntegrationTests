// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { SpecificationResult } from './SpecificationResult';

export class ScenarioResult {
    readonly name!: string;
    readonly result!: SpecificationResult;
}
