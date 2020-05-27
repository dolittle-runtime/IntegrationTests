// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/rudiments';
import { ScenarioContext, ScenarioFor } from '../../gherkin';

export class ScenarioInProcedure<T extends ScenarioContext> {
    readonly scenarioType!: Constructor<ScenarioFor<T>>;

    /**
     * Percentage of scenario in procedure - 0 means the system will distribute it evenly.
     * Default is 0
     */
    percentage: number = 0;
}
