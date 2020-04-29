// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioFor } from '../ScenarioFor';
import { SpecificationBuilder } from '../SpecificationBuilder';
import { MyContext } from './MyContext';


class ScenarioWithoutFeature extends ScenarioFor<MyContext> {
    for = MyContext;

    when_doing_stuff = () => { };
    and = () => [this.first_and, this.second_and, this.third_and];

    first_and = () => { };
    second_and = () => { };
    third_and = () => { };
}

describe('when building for scenario with three ands as properties', () => {
    const builder: SpecificationBuilder = new SpecificationBuilder();

    const specification = builder.buildFrom(new ScenarioWithoutFeature());

    it('should have three ands', () => specification.ands.length.should.equal(3));
    it('should have first and', () => specification.ands.filter(_ => _.name === 'first and').length.should.equal(1));
    it('should have second and', () => specification.ands.filter(_ => _.name === 'second and').length.should.equal(1));
    it('should have third and', () => specification.ands.filter(_ => _.name === 'third and').length.should.equal(1));
});
