// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Context } from '../Context';

import { ScenarioFor } from '../ScenarioFor';
import { SpecificationBuilder } from '../SpecificationBuilder';
import { MissingWhenMethod } from '../MissingWhenMethod';

class MyContext extends Context {
}

class ScenarioWithoutFeature extends ScenarioFor<MyContext> {
    for = MyContext;

    when_doing_things = () => { };
}

describe('when building for scenario with when as property', () => {
    const builder: SpecificationBuilder = new SpecificationBuilder();

    const specification = builder.buildFrom(new ScenarioWithoutFeature());

    it('should have the when method', () => specification.when.becauseOf.name.should.equal('when doing things'));
});
