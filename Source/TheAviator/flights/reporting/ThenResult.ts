// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { BrokenRule } from './BrokenRule';

export class ThenResult {
    readonly then!: string;
    readonly brokenRules!: BrokenRule[];
}
