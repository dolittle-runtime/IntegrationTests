// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '../Constructor';
import { ScenarioFor } from '../gherkin';
import { PreflightChecklist } from './PreflightChecklist';

export interface IPreflightPlanner {
    createChecklistFor(target: string, ...scenarios: Constructor<ScenarioFor<any>>[]): PreflightChecklist
}
