// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { MongoClient, FilterQuery, Decimal128 } from 'mongodb';
import MUUID from 'uuid-mongodb';

import { Guid } from '@dolittle/rudiments';
import { RuleSetContainerEvaluation, BrokenRule } from '@dolittle/rules';

import { EventLogRuleSetContainerBuilder, StreamProcessorRuleSetContainerBuilder } from '../rules';

import { IEventStore } from './IEventStore';
import { Microservice } from '../microservices';

export class EventStore implements IEventStore {
    readonly microservice: Microservice;
    eventLog: EventLogRuleSetContainerBuilder | undefined;
    streamProcessors: StreamProcessorRuleSetContainerBuilder | undefined;

    constructor(microservice: Microservice) {
        this.microservice = microservice;
    }

    async findEvents(tenantId: Guid, filter: FilterQuery<any>): Promise<any[]> {
        return this.findDocumentsInCollection(tenantId, 'event-log', filter);
    }

    async getStreamProcessorState(tenantId: Guid, eventProcessorId: Guid, sourceStreamId: Guid): Promise<any> {
        try {
            const eventStoresForTenants = this.microservice.configuration.eventStoreForTenants.filter(_ => _.tenantId);
            if (eventStoresForTenants.length !== 1) {
                return {};
            }

            const client = await this.getMongoClient();
            const collection = client.db(eventStoresForTenants[0].database).collection('stream-processor-states');

            const query = {
                '_id.EventProcessorId': MUUID.from(eventProcessorId.toString()),
                '_id.SourceStreamId': MUUID.from(sourceStreamId.toString())
            };

            const result = await collection.findOne(query);
            await client.close();
            if (!result) {
                return {
                    Position: -1,
                    FailingPartitions: {}
                };
            }
            return {
                Position: parseInt(result.Position.toString(), 10),
                FailingPartitions: result.FailingPartitions
            };
        } catch (ex) {
            return {};
        }
    }

    async beginEvaluation() {
        this.eventLog = new EventLogRuleSetContainerBuilder(this.microservice);
        this.streamProcessors = new StreamProcessorRuleSetContainerBuilder(this.microservice);
    }

    async endEvaluation(): Promise<BrokenRule[]> {
        let brokenRules: BrokenRule[] = [];

        if (this.eventLog) {
            const eventLogRuleSetContainer = this.eventLog.build();
            const eventLogEvaluation = new RuleSetContainerEvaluation(eventLogRuleSetContainer);
            await eventLogEvaluation.evaluate(this);
            brokenRules = brokenRules.concat(eventLogEvaluation.brokenRules);
        }

        if (this.streamProcessors) {
            const streamProcessorRuleSetContainer = this.streamProcessors.build();
            const streamProcessorEvaluation = new RuleSetContainerEvaluation(streamProcessorRuleSetContainer);
            await streamProcessorEvaluation.evaluate(this);
            brokenRules = brokenRules.concat(streamProcessorEvaluation.brokenRules);
        }
        return brokenRules;
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
