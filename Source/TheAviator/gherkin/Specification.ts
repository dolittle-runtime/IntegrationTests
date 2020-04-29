// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Given } from './Given';
import { When } from './When';
import { FeatureDefinition } from './FeatureDefinition';
import { Then } from './Then';
import { BecauseOf } from './BecauseOf';

export class Specification {
    readonly feature!: FeatureDefinition;
    readonly givens!: Given[];
    readonly when!: When;
    readonly ands!: BecauseOf[];
    readonly thens!: Then[];
    readonly children: Specification[] = [];
}
