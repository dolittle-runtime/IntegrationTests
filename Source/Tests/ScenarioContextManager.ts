// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IScenarioContextManager } from './IScenarioContextManager';
import { Constructor } from './Constructor';
import { IGiven } from './IGiven';
import { ScenarioContext } from './ScenarioContext';

export class ScenarioContextManager implements IScenarioContextManager {
    getFor(givenStatement: Constructor<IGiven>): ScenarioContext {
        throw new Error('Method not implemented.');
    }
}
