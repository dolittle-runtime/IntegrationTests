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

    then_first() {}
    then_second() {}
    then_third() {}
}

describe('when building for scenario with three thens', () => {
    const builder: SpecificationBuilder = new SpecificationBuilder();

    const specification = builder.buildFrom(new ScenarioWithoutFeature());

    it('should have three thens', () => specification.thens.length.should.equal(3));
    it('should have first then', () => specification.thens.some(_ => _.name === 'then first').should.be.true);
    it('should have second then', () => specification.thens.some(_ => _.name === 'then second').should.be.true);
    it('should have third then', () => specification.thens.some(_ => _.name === 'then third').should.be.true);
});
