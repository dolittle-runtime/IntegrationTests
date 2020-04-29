// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { FilterQuery } from 'mongodb';
import { Guid } from '@dolittle/rudiments';
import { StreamProcessorState } from './StreamProcessorState';

export interface IEventStore {
    findEvents(tenantId: Guid, stream: string, filter: FilterQuery<any>): Promise<any[]>
    getStreamProcessorState(tenantId: Guid, eventProcessorId: Guid, sourceStreamId: Guid): Promise<StreamProcessorState | null>;
    dump(): Promise<string[]>;
    clear(): Promise<void>;
}
