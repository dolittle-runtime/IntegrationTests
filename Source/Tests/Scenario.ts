// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from './Constructor';
import { IGiven } from './IGiven';
import { Context } from 'Context';

export class Scenario {
    context: Context | undefined;
    given: Constructor<IGiven> | undefined;
}
