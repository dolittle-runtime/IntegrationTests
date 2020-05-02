// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario, ScenarioResult } from '../gherkin';
import { Microservice } from '../microservices';

export interface IFlightRecorder {
    conclude(): void;
    captureMetricsFor(scenario: Scenario): Promise<void>;
    reportResultFor(scenarioResult: ScenarioResult): Promise<void>;

    writeConfigurationFilesFor(microservices: Microservice[]): void;
    collectLogsFor(microservices: Microservice[]): void;
}
