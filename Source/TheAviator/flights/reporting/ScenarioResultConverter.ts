// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioResult as ReportingScenarioResult } from './ScenarioResult';
import { ScenarioResult } from '../../gherkin';
import { IScenarioResultConverter } from './IScenarioResultConverter';
import { ISpecificationResultConverter } from './ISpecificationResultConverter';

export class ScenarioResultConverter implements IScenarioResultConverter {
    constructor(private _specificationResultConverter: ISpecificationResultConverter) {
    }

    convert(input: ScenarioResult): ReportingScenarioResult {
        return {
            name: input.scenario.name,
            result: this._specificationResultConverter.convert(input.result)
        };
    }
}
