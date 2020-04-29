// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '../Constructor';
import { ScenarioContext } from './ScenarioContext';

export interface IContextDescriptorFor<T extends ScenarioContext> {
    for: Constructor<T>;
    and(): Function[];
}
