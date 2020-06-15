// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EventObject } from '../tests/shared/EventObject';

export interface IMicroserviceActions {
    checkStatus(): Promise<string>;
    commitEvents(tenantId: Guid, eventSource: Guid, ...events: EventObject[]): Promise<void>;
    commitPublicEvents(tenantId: Guid, eventSource: Guid, ...events: EventObject[]): Promise<void>;
    commitAggregateEvents(tenantId: Guid, eventSource: Guid, version: number, ...events: EventObject[]): Promise<void>;
    getRuntimeMetrics(): Promise<string>;
}
