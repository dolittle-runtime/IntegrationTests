// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioFor } from '../ScenarioFor';
import { SpecificationBuilder } from '../SpecificationBuilder';
import { FeatureDefinition } from '../FeatureDefinition';
import { MyContext } from './MyContext';

class ScenarioWithoutFeature extends ScenarioFor<MyContext> {
    for = MyContext;

    when_doing_things = () => { };
}

describe('when building for scenario without feature', () => {
    const builder: SpecificationBuilder = new SpecificationBuilder();

    const specification = builder.buildFrom(new ScenarioWithoutFeature());

    it('should return a specification', () => specification.should.not.be.undefined);
    it('should have an undefined feature', () => specification.feature.should.equal(FeatureDefinition.unspecified));
    it('should have the when method', () => specification.when.name.should.equal('doing things'));
});
