// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioFor } from '../ScenarioFor';
import { MyContext } from './MyContext';

class MyScenario extends ScenarioFor<MyContext> {
    for = MyContext;
}

describe('when instantiating an implementation', () => {
    const scenario = new MyScenario();
    it('should have the for correct', () => scenario.for.prototype.should.equal(MyContext.prototype));
});
