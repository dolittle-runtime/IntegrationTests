// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioContext } from '../../gherkin';
import { BehaviorInProcedure } from './BehaviorInProcedure';
import { UnexpectedBehaviorInProcedure } from './UnexpectedBehaviorInProcedure';

export interface IFlightSimulationProcedure<T extends ScenarioContext> {
    readonly behaviors: BehaviorInProcedure<T>[];
    readonly unexpectedBehaviors: UnexpectedBehaviorInProcedure<T>[];
}
