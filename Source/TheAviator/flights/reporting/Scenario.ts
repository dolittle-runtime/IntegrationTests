// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Specification } from './Specification';

export class Scenario {
    readonly name!: string;
    readonly context!: string;
    readonly specification!: Specification;
}
