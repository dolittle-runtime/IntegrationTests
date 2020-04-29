// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioFor } from '../ScenarioFor';
import { SpecificationBuilder } from '../SpecificationBuilder';
import { ThenIsNotAMethod } from '../ThenIsNotAMethod';
import { MyContext } from './MyContext';


class ScenarioWithoutFeature extends ScenarioFor<MyContext> {
    for = MyContext;

    when_doing_stuff = () => {};

    then_something = 42;
}

describe('when building for scenario with then not a method', () => {
    const builder: SpecificationBuilder = new SpecificationBuilder();

    let exception: Error | undefined;

    try {
        builder.buildFrom(new ScenarioWithoutFeature());
    } catch (ex) {
        exception = ex;
    }

    it('should throw an exception', () => (exception instanceof ThenIsNotAMethod).should.be.true);
});
