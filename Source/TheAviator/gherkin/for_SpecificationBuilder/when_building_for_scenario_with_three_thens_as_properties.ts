// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioFor } from '../ScenarioFor';
import { SpecificationBuilder } from '../SpecificationBuilder';
import { MyContext } from './MyContext';

class ScenarioWithoutFeature extends ScenarioFor<MyContext> {
    for = MyContext;

    when_doing_things = () => { };

    then_first_rule = () => {};
    then_second_rule = () => {};
    then_third_rule = () => {};
}

describe('when building for scenario with three thens as properties', () => {
    const builder: SpecificationBuilder = new SpecificationBuilder();

    const specification = builder.buildFrom(new ScenarioWithoutFeature());
    
    it('should have three thens', () => specification.thens.length.should.equal(3));
    it('should have first then', () => specification.thens.some(_ => _.name === 'first rule').should.be.true);
    it('should have second then', () => specification.thens.some(_ => _.name === 'second rule').should.be.true);
    it('should have third then', () => specification.thens.some(_ => _.name === 'third rule').should.be.true);
});
