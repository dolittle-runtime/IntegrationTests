// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioContext, IGiven } from 'gherkin';

import { ISimulatedFault } from './ISimulatedFault';

export interface IUnexpectedBehaviorFor<T extends IGiven> {
    readonly context: ScenarioContext;
    readonly faults: ISimulatedFault[];
}
