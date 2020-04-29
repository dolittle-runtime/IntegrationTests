// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Context } from './Context';
import { Constructor } from '../Constructor';
import { IContextDescriptorFor } from './IContextDescriptorFor';

export abstract class BehaviorFor<T extends Context> implements IContextDescriptorFor<T> {
    abstract for: Constructor<T>;
    and(): Function[] {
        return [];
    }
}
