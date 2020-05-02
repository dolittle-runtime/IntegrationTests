// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Specification } from './Specification';
import { SpecificationResult } from './SpecificationResult';
import { ScenarioContext } from './ScenarioContext';
import { ScenarioFor } from './ScenarioFor';

export interface ISpecificationRunner {
    run(scenarioFor: ScenarioFor<ScenarioContext>, specification: Specification): Promise<SpecificationResult>;
}


