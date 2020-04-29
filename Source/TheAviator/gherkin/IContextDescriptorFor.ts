// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '../Constructor';
import { Context } from './Context';

export interface IContextDescriptorFor<T extends Context> {
    for: Constructor<T>;
    and(): Function[];
}
