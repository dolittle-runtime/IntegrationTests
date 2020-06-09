// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { FilterQuery } from 'mongodb';
import { Guid } from '@dolittle/rudiments';

export interface IEventStore {
    findEvents(tenantId: Guid, stream: string, filter: FilterQuery<any>): Promise<any[]>
    getStreamProcessorState(tenantId: Guid, eventProcessorId: Guid, scopeId: Guid, sourceStreamId: Guid): Promise<any>;
    dump(path: string): Promise<string[]>;
    clear(): Promise<void>;
}
