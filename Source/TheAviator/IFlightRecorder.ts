// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { RuleSetContainerEvaluation } from '@dolittle/rules';
import { Flight } from './Flight';
import { Scenario } from './Scenario';
import { Microservice } from './Microservice';
import { ScenarioContext } from './ScenarioContext';

export interface IFlightRecorder {
    conclude(): void;
    setCurrentScenarioContext(scenarioContext: ScenarioContext): void;
    setCurrentScenario(scenario: Scenario): void;
    reportResultFor(scenario: Scenario, microservice: Microservice, evaluation: RuleSetContainerEvaluation): Promise<void>;
}
