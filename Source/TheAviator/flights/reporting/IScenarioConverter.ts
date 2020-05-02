// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario as ReportingScenario } from './Scenario';
import { Scenario } from '../../gherkin';

export interface IScenarioConverter {
    convert(input: Scenario): ReportingScenario;
}
