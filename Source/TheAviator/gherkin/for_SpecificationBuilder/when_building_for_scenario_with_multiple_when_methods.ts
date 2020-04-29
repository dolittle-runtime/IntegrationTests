// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioFor } from '../ScenarioFor';
import { SpecificationBuilder } from '../SpecificationBuilder';
import { MultipleWhenMethods } from '../MultipleWhenMethods';
import { MyContext } from './MyContext';

class ScenarioWithoutFeature extends ScenarioFor<MyContext> {
    for = MyContext;

    when_doing_stuff = () => { };
    when_doing_more_stuff = () => { };
}

describe('when building for scenario with multiple when methods', () => {
    const builder: SpecificationBuilder = new SpecificationBuilder();

    let exception: Error | undefined;

    try {
        builder.buildFrom(new ScenarioWithoutFeature());
    } catch (ex) {
        exception = ex;
    }

    it('should throw an exception', () => (exception instanceof MultipleWhenMethods).should.be.true);
});
