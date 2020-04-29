// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IGiven } from 'gherkin';
import { BehaviorFor } from '../../gherkin';
import { Constructor } from 'Constructor';

export class BehaviorInProcedure<T extends IGiven> {
    readonly behaviorType!: Constructor<BehaviorFor<T>>;
    readonly percentage!: number;
}
