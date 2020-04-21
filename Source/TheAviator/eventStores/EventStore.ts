// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { MongoClient, FilterQuery } from 'mongodb';
import { Guid } from '@dolittle/rudiments';
import { RuleSetContainerEvaluation, RuleSetContainer } from '@dolittle/rules';

import { EventLogRuleSetContainerBuilder } from '../rules/EventLogRuleSetContainerBuilder';
import { IEventStore } from './IEventStore';
import { Microservice } from '../microservices';

export class EventStore implements IEventStore {
    readonly microservice: Microservice;
    eventLog: EventLogRuleSetContainerBuilder | undefined;

    constructor(microservice: Microservice) {
        this.microservice = microservice;
    }

    async findEvents(tenantId: Guid, filter: FilterQuery<any>): Promise<any[]> {
        return this.findDocumentsInCollection(tenantId, 'event-log', filter);
    }

    async beginEvaluation() {
        this.eventLog = new EventLogRuleSetContainerBuilder(this.microservice);
    }

    async endEvaluation(): Promise<RuleSetContainerEvaluation> {
        if (this.eventLog) {
            const eventLogRuleSetContainer = this.eventLog.build();
            const eventLogEvaluation = new RuleSetContainerEvaluation(eventLogRuleSetContainer);
            await eventLogEvaluation.evaluate(this);
            return eventLogEvaluation;
        }
        return new RuleSetContainerEvaluation(new RuleSetContainer());
    }

    async dump(): Promise<string[]> {
        const backups: string[] = [];
        for (const eventStoreForTenant of this.microservice.configuration.eventStoreForTenants) {
            const backupName = `${Guid.create()} ${eventStoreForTenant.tenantId}`;
            backups.push(backupName);

            await this.microservice.eventStoreStorage.exec([
                'mongodump',
                `--archive="/backup/${backupName}"`,
                '-d',
                eventStoreForTenant.database
            ], {});
        }

        return backups;
    }

    async clear(): Promise<void> {
        try {
            const client = await this.getMongoClient();
            for (const eventStoreForTenant of this.microservice.configuration.eventStoreForTenants) {
                const db = client.db(eventStoreForTenant.database);
                const collections = await db.collections();
                for (const collection of collections) {
                    await collection.deleteMany({});
                }
            }
        } catch (ex) {

        }
    }

    private async findDocumentsInCollection(tenantId: Guid, collectionName: string, filter: FilterQuery<any>): Promise<any[]> {
        try {
            const eventStoresForTenants = this.microservice.configuration.eventStoreForTenants.filter(_ => _.tenantId);
            if (eventStoresForTenants.length !== 1) {
                return [];
            }

            const client = await this.getMongoClient();
            const collection = client.db(eventStoresForTenants[0].database).collection(collectionName);
            const result = await collection.find(filter).toArray();
            await client.close();
            return result;
        }
        catch (ex) {
            return [];
        }
    }

    private async getMongoClient() {
        const url = `mongodb://localhost:${this.microservice.eventStoreStorage.boundPorts.get(27017)}`;
        const client = await MongoClient.connect(url, { useUnifiedTopology: true });
        return client;
    }
}
