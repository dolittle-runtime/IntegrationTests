// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { SpecificationResult as ReportingSpecificationResult } from './SpecificationResult';
import { SpecificationResult } from '../../gherkin';

export interface ISpecificationResultConverter {
    convert(input: SpecificationResult): ReportingSpecificationResult;
}

