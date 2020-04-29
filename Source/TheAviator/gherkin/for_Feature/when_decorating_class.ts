// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Feature } from '../Feature';

const featureName = 'Some name';
const featureDescription = 'Some description';

@Feature(featureName, featureDescription)
class ClassWithFeature {
}


describe('when decorating class', () => {
    const feature = (ClassWithFeature as any)._feature;

    it('should set the feature with name', () => feature.name.should.equal(featureName));
    it('should set the feature with description', () => feature.description.should.equal(featureDescription));

});
