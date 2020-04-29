// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Context } from '../Context';

import { ScenarioFor } from '../ScenarioFor';
import { SpecificationBuilder } from '../SpecificationBuilder';

class MyContext extends Context {
}

class ScenarioWithoutFeature extends ScenarioFor<MyContext> {
    for = MyContext;

    when_doing_things = () => { };
}

describe('when building for scenario without feature', () => {
    const builder: SpecificationBuilder = new SpecificationBuilder();

    const specification = builder.buildFrom(new ScenarioWithoutFeature());

    it('should return a specification', () => specification.should.not.be.undefined);
    it('should have an undefined feature', () => specification.feature.should.equal(SpecificationBuilder.UndefinedFeature));
    it('should have the when method', () => specification.when.becauseOf.name.should.equal('when doing things'));
});
