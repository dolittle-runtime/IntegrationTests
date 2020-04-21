// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { RuleSetContainerEvaluation } from '@dolittle/rules';
import { Scenario } from '../gherkin/Scenario';
import { Microservice } from '../microservices/Microservice';
import { ScenarioContext } from '../gherkin/ScenarioContext';

export interface IFlightRecorder {
    conclude(): void;
    setCurrentScenarioContext(scenarioContext: ScenarioContext): void;
    setCurrentScenario(scenario: Scenario): void;
    reportResultFor(scenario: Scenario, microservice: Microservice, evaluation: RuleSetContainerEvaluation): Promise<void>;
}
