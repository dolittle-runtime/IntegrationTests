// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

export class StreamProcessorState {
    readonly scopeId: Guid;
    readonly eventProcessorId: Guid;
    readonly sourceStreamId: Guid;
    readonly position: number;
    readonly failingPartitions: any;

    constructor(eventProcessorId?: Guid, sourceStreamId?: Guid, scopeId?: Guid, position?: number) {
        this.scopeId = scopeId || Guid.empty;
        this.eventProcessorId = eventProcessorId || Guid.empty;
        this.sourceStreamId = sourceStreamId || Guid.empty;
        this.position = position || 0;
    }
}
