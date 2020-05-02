// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario as ReportingScenario } from './Scenario';
import { Scenario } from '../../gherkin';
import { IScenarioConverter } from './IScenarioConverter';
import { ISpecificationConverter } from './ISpecificationConverter';

export class ScenarioConverter implements IScenarioConverter {
    constructor(readonly _specificationConverter: ISpecificationConverter) {
    }

    convert(input: Scenario): ReportingScenario {
        return {
            name: input.name,
            context: input.contextName,
            specification: this._specificationConverter.convert(input.specification)
        };
    }
}
