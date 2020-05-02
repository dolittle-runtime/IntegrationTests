// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Specification as ReportingSpecification } from './Specification';
import { Specification } from '../../gherkin';
import { ISpecificationConverter } from './ISpecificationConverter';

export class SpecificationConverter implements ISpecificationConverter {
    convert(input: Specification): ReportingSpecification {
        return {
            feature: {
                name: input.feature.name,
                description: input.feature.description
            },
            givens: input.givens.map(_ => { return _.name; }),
            when: input.when.name,
            ands: input.ands.map(_ => { return _.name; }),
            thens: input.thens.map(_ => { return _.name; }),
            children: input.children.map(_ => this.convert(_))
        };
    }
}
