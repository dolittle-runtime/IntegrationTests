// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { FilterQuery } from 'mongodb';
import { BrokenRule } from '@dolittle/rules';
import { Guid } from '@dolittle/rudiments';

import { EventLogRuleSetContainerBuilder, StreamProcessorRuleSetContainerBuilder } from 'rules';
import { StreamProcessorState } from './StreamProcessorState';

export interface IEventStore {
    eventLog: EventLogRuleSetContainerBuilder | undefined;
    streamProcessors: StreamProcessorRuleSetContainerBuilder | undefined;

    findEvents(tenantId: Guid, filter: FilterQuery<any>): Promise<any[]>
    beginEvaluation(): Promise<void>;
    endEvaluation(): Promise<BrokenRule[]>;

    getStreamProcessorState(tenantId: Guid, eventProcessorId: Guid, sourceStreamId: Guid): Promise<StreamProcessorState>;

    dump(): Promise<string[]>;
    clear(): Promise<void>;
}
