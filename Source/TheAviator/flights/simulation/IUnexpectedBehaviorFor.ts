// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioEnvironment, IGiven } from '../../gherkin';

import { ISimulatedFault } from './ISimulatedFault';

export interface IUnexpectedBehaviorFor<T extends IGiven> {
    readonly context: ScenarioEnvironment;
    readonly faults: ISimulatedFault[];
}
