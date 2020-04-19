// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { RuleSetContainerEvaluation } from '@dolittle/rules';
import { Flight } from './Flight';
import { Scenario } from './Scenario';
import { Microservice } from './Microservice';

export interface IFlightRecorder {
    recordFor(flight: Flight): void;
    setCurrentScenario(scenario: Scenario): void;
    reportResultFor(flight: Flight, scenario: Scenario, microservice: Microservice, evaluation: RuleSetContainerEvaluation): void;
}
