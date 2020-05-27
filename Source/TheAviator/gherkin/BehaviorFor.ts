// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioContext } from './ScenarioContext';
import { Constructor } from '@dolittle/rudiments';
import { IContextDescriptorFor } from './IContextDescriptorFor';

export abstract class BehaviorFor<T extends ScenarioContext> implements IContextDescriptorFor<T> {
    abstract for: Constructor<T>;
    and(): Function[] {
        return [];
    }
}
