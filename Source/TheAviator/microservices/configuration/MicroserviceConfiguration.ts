// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventStoreTenantConfiguration } from './EventStoreTenantConfiguration';
import { HeadConfiguration } from './HeadConfiguration';
import { RuntimeConfiguration } from './RuntimeConfiguration';
import { Guid } from '@dolittle/rudiments';
import { Tenant } from './Tenant';

export class MicroserviceConfiguration {
    platform: string;
    identifier: string;
    shortIdentifier: string;
    name: string;
    eventStoreForTenants: EventStoreTenantConfiguration[];
    tenants: Tenant[];
    runtime: RuntimeConfiguration;
    head: HeadConfiguration;
    mongoHost: string;
    networkName: string;

    constructor(
        platform: string,
        name: string,
        identifier: Guid,
        tenants: Guid[]) {

        this.platform = platform;
        this.name = name;
        this.identifier = identifier.toString();
        this.shortIdentifier = this.identifier.substr(0, 8);

        this.networkName = `${this.name}-${this.identifier}-network`;

        this.mongoHost = `mongo-${this.shortIdentifier}`;
        const runtimeHost = `runtime-${this.shortIdentifier}`;
        const headHost = `head-${this.shortIdentifier}`;

        this.runtime = new RuntimeConfiguration(runtimeHost, 50052, 50053);
        this.head = new HeadConfiguration(headHost);

        this.eventStoreForTenants = tenants.map(tenant => new EventStoreTenantConfiguration(tenant, this.mongoHost));
        this.tenants = tenants.map(tenant => new Tenant(tenant));
    }
}
