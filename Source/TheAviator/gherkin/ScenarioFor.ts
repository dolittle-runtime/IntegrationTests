// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '../Constructor';
import { Context } from './Context';
import { IContextDescriptorFor } from './IContextDescriptorFor';

export abstract class ScenarioFor<T extends Context> implements IContextDescriptorFor<T> {
    abstract for: Constructor<T>;
    and(): Function[] {
        return [];
    }

    behavesLike(): Constructor<IContextDescriptorFor<T>>[] {
        return [];
    }
}
