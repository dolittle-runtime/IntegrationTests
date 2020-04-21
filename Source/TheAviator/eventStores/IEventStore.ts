// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { FilterQuery } from 'mongodb';
import { RuleSetContainerEvaluation } from '@dolittle/rules';

import { EventLogRuleSetContainerBuilder } from '../rules/EventLogRuleSetContainerBuilder';
import { Guid } from '@dolittle/rudiments';

export interface IEventStore {
    eventLog: EventLogRuleSetContainerBuilder | undefined;

    findEvents(tenantId: Guid, filter: FilterQuery<any>): Promise<any[]>
    beginEvaluation(): Promise<void>;
    endEvaluation(): Promise<RuleSetContainerEvaluation>;

    dump(): Promise<string[]>;
    clear(): Promise<void>;
}
