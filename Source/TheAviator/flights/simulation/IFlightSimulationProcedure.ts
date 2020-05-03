// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioContext } from '../../gherkin';
import { ScenarioInProcedure } from './ScenarioInProcedure';
import { UnexpectedBehaviorInProcedure } from './UnexpectedBehaviorInProcedure';
import { Constructor } from 'Constructor';

export interface IFlightSimulationProcedure<T extends ScenarioContext> {
    readonly context: Constructor<T>;
    readonly scenarios: ScenarioInProcedure<T>[];
    readonly unexpectedBehaviors: UnexpectedBehaviorInProcedure<T>[];
}
