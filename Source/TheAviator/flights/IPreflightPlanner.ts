// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '../Constructor';
import { Given } from '../gherkin';
import { PreflightChecklist } from './PreflightChecklist';

export interface IPreflightPlanner {
    createChecklistFor(target: string, ...scenarios: Constructor<any>[]): PreflightChecklist
}
