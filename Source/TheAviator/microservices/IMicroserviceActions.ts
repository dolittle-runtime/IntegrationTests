// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { EventObject } from '../tests/shared/EventObject';

export interface IMicroserviceActions {
    checkStatus(): Promise<string>;
    commitEvent(tenantId: Guid, eventSource: Guid, artifactId: Guid, event: EventObject, publicEvent?: boolean): Promise<void>;
    commitPublicEvent(tenantId: Guid, eventSource: Guid, artifactId: Guid, event: EventObject): Promise<void>;
    commitAggregateEvent(tenantId: Guid, eventSource: Guid, version: number, artifactId: Guid, event: EventObject): Promise<void>;
    commitEvents(tenantId: Guid, eventSource: Guid, artifactId: Guid, events: EventObject[], publicEvent?: boolean): Promise<void>;
    commitPublicEvents(tenantId: Guid, eventSource: Guid, artifactId: Guid, events: EventObject[]): Promise<void>;
    commitAggregateEvents(tenantId: Guid, eventSource: Guid, version: number, artifactId: Guid, events: EventObject[]): Promise<void>;
    getRuntimeMetrics(): Promise<string>;
}
