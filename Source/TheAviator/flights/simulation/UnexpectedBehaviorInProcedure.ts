// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IGiven } from '../../gherkin';
import { IUnexpectedBehaviorFor } from './IUnexpectedBehaviorFor';

export class UnexpectedBehaviorInProcedure<T extends IGiven> {
    readonly unexpectedBehavior!: IUnexpectedBehaviorFor<T>;
    readonly percentage!: number;
}
