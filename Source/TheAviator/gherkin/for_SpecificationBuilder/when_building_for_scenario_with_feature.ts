// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioFor } from '../ScenarioFor';
import { SpecificationBuilder } from '../SpecificationBuilder';
import { MyContext } from './MyContext';
import { Feature } from '../Feature';

const featureName = 'Some name';
const featureDescription = 'Some description';

@Feature(featureName, featureDescription)
class ScenarioWithFeature extends ScenarioFor<MyContext> {
    for = MyContext;

    when_doing_things = () => { };
}

describe('when building for scenario with feature', () => {
    const builder: SpecificationBuilder = new SpecificationBuilder();

    const specification = builder.buildFrom(new ScenarioWithFeature());

    it('should have the correct feature with name', () => specification.feature.name.should.equal(featureName));
    it('should have the correct feature with description', () => specification.feature.description.should.equal(featureDescription));
});

