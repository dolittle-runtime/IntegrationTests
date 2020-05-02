// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario } from './Scenario';
import { SpecificationResult } from './SpecificationResult';

export class ScenarioResult {
    readonly scenario: Scenario;
    readonly result: SpecificationResult;

    constructor(scenario: Scenario, result: SpecificationResult) {
        this.scenario = scenario;
        this.result = result;
    }
}
