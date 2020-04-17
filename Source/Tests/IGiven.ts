// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IMicroserviceFactory } from './IMicroserviceFactory';
import { ScenarioContext } from './ScenarioContext';

export interface IGiven {
    context(microserviceFactory: IMicroserviceFactory): ScenarioContext;
}
