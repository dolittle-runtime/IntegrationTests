// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/rudiments';
import { ScenarioFor, ScenarioContext } from '../gherkin';
import { PreflightChecklist } from './PreflightChecklist';

export interface IPreflightPlanner {
    createChecklistFor(target: string, ...scenarios: Constructor<ScenarioFor<ScenarioContext>>[]): Promise<PreflightChecklist>
}
