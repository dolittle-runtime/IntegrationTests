// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Subject } from 'rxjs';

import { Scenario, ScenarioResult } from '../gherkin';

import { ScenarioResult as ReportingScenarioResult } from './reporting';

export interface IFlightRecorder {
    readonly scenarioResult: Subject<ReportingScenarioResult>;

    conclude(): void;
    captureMetricsFor(scenario: Scenario): Promise<void>;
    resultsFor(scenarioResult: ScenarioResult): Promise<void>;
}
