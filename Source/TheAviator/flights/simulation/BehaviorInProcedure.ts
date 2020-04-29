// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { BehaviorFor, ScenarioContext } from '../../gherkin';
import { Constructor } from 'Constructor';

export class BehaviorInProcedure<T extends ScenarioContext> {
    readonly behaviorType!: Constructor<BehaviorFor<T>>;
    readonly percentage!: number;
}
