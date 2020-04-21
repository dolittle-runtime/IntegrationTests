// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

export class EventStoreTenantConfiguration {
    readonly tenantId: string;
    readonly server: string;
    readonly database: string;

    constructor(tenantId: Guid, server: string) {
        this.tenantId = tenantId.toString();
        this.server = server;

        const shortIdentifier = this.tenantId.substr(0, 8);
        this.database = `event-store-${shortIdentifier}`;
    }
}
