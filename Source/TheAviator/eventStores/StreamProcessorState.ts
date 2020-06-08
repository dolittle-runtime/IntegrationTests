// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

export class StreamProcessorState {
    constructor(
        readonly eventProcessorId?: Guid,
        readonly sourceStreamId?: Guid,
        readonly scopeId?: Guid,
        readonly position?: number,
        readonly isFailing?: boolean) {
    }
}
