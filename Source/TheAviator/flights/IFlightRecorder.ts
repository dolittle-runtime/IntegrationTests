// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { BrokenRule } from '@dolittle/rules';

import { Scenario } from '../gherkin';
import { Microservice } from '../microservices';

export interface IFlightRecorder {
    conclude(): void;
    writeConfigurationFilesFor(microservices: Microservice[]): void;
    collectLogsFor(microservices: Microservice[]): void;
    reportResultFor(scenario: Scenario, microservice: Microservice, brokenRules: BrokenRule[]): Promise<void>;
}
