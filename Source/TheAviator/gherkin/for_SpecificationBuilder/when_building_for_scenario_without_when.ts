// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioFor } from '../ScenarioFor';
import { SpecificationBuilder } from '../SpecificationBuilder';
import { MissingWhenMethod } from '../MissingWhenMethod';
import { MyContext } from './MyContext';

class ScenarioWithoutFeature extends ScenarioFor<MyContext> {
    for = MyContext;
}

describe('when building for scenario without when', () => {
    const builder: SpecificationBuilder = new SpecificationBuilder();

    let exception: Error | undefined;

    try {
        builder.buildFrom(new ScenarioWithoutFeature());
    } catch (ex) {
        exception = ex;
    }

    it('should throw an exception', () => (exception instanceof MissingWhenMethod).should.be.true);
});
