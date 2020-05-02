// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Specification as ReportingSpecification } from './Specification';
import { Specification } from '../../gherkin';

export interface ISpecificationConverter {
    convert(input: Specification): ReportingSpecification;
}
