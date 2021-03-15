// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { EventStoreTenantConfiguration } from './EventStoreTenantConfiguration';
import { RuntimeConfiguration } from './RuntimeConfiguration';
import { Guid } from '@dolittle/rudiments';
import { Tenant } from './Tenant';
import { EventHorizonTenantConsentConfiguration } from './EventHorizonTenantConsentConfiguration';
import { EventHorizonConfiguration } from './EventHorizonConfiguration';
import { MicroserviceDefinition } from '../MicroserviceDefinition';


export class MicroserviceConfiguration {
    platform: string;
    identifier: string;
    shortIdentifier: string;
    name: string;
    eventStoreForTenants: EventStoreTenantConfiguration[];
    tenants: Tenant[];
    runtime: RuntimeConfiguration;
    headHost: string;
    mongoHost: string;
    networkName: string;
    producers: MicroserviceConfiguration[] = [];
    consumers: MicroserviceConfiguration[] = [];
    consents: EventHorizonTenantConsentConfiguration[] = [];
    eventHorizons: EventHorizonConfiguration[] = [];

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
        this.headHost = `head-${this.shortIdentifier}`;

        this.runtime = new RuntimeConfiguration(runtimeHost, 50052, 50053);

        this.eventStoreForTenants = tenants.map(tenant => new EventStoreTenantConfiguration(tenant, this.mongoHost));
        this.tenants = tenants.map(tenant => new Tenant(tenant));
    }

    addProducer(producer: MicroserviceConfiguration) {
        this.producers.push(producer);
        producer.addConsumer(this);

        for (const tenant of this.tenants) {
            this.eventHorizons.push(new EventHorizonConfiguration(tenant.tenantId, tenant.tenantId, producer.identifier, 'de594e7b-d160-44e4-9901-ae84fc70424a', '82f35eaa-8317-4c8b-9bd6-f16c212fda96'));
        }
    }

    addConsumer(consumer: MicroserviceConfiguration) {
        this.consumers.push(consumer);

        for (const tenant of this.tenants) {
            this.consents.push(new EventHorizonTenantConsentConfiguration(tenant.tenantId, tenant.tenantId, consumer.identifier, '82f35eaa-8317-4c8b-9bd6-f16c212fda96'));
        }
    }

    static from(platform: string, definition: MicroserviceDefinition) {
        const configuration = new MicroserviceConfiguration(platform, definition.name, definition.identifier, definition.tenants);
        return configuration;
    }
}
