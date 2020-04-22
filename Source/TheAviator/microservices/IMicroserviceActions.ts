// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

export interface IMicroserviceActions {
    checkStatus(): Promise<string>;
    commitEvent(tenantId: Guid, artifactId: Guid, content: any, publicEvent?: boolean): Promise<void>;
    commitPublicEvent(tenantId: Guid, artifactId: Guid, content: any): Promise<void>;
    commitAggregateEvent(tenantId: Guid, eventSource: Guid, version: number, artifactId: Guid, content: any): Promise<void>;
    getRuntimeMetrics(): Promise<string>;
}
