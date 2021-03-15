// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import fs from 'fs';
import path from 'path';

import { MongoClient, FilterQuery, ReadPreference, MongoClientOptions } from 'mongodb';
import MUUID from 'uuid-mongodb';

import { Guid } from '@dolittle/rudiments';

import { IEventStore } from './IEventStore';
import { Microservice } from '../microservices';

export class EventStore implements IEventStore {
    readonly microservice: Microservice;
    readonly _url: string;
    readonly _options: MongoClientOptions;

    constructor(microservice: Microservice) {
        this.microservice = microservice;
        this._url = `mongodb://localhost:${this.microservice.eventStoreStorage.boundPorts.get(27017)}`;
        this._options = {
            // useUnifiedTopology: true,
            useNewUrlParser: true,
            readPreference: ReadPreference.PRIMARY,
            ssl: false,
        };
    }

    async findEvents(tenantId: Guid, stream: string, filter: FilterQuery<any>): Promise<any[]> {
        return this.findDocumentsInCollection(tenantId, stream, filter);
    }

    async getStreamProcessorState(tenantId: Guid, eventProcessorId: Guid, scopeId: Guid, sourceStreamId: Guid): Promise<any> {
        try {
            const eventStoresForTenants = this.microservice.configuration.eventStoreForTenants.filter(_ => _.tenantId);
            if (eventStoresForTenants.length !== 1) {
                return null;
            }

            const client = await this.getMongoClient();
            const collectionName = scopeId === Guid.empty ? 'stream-processor-states' : `x-${scopeId.toString()}-stream-processor-states`;
            const collection = client.db(eventStoresForTenants[0].database).collection(collectionName);

            const query = {
                'EventProcessor': MUUID.from(eventProcessorId.toString()),
                'SourceStream': MUUID.from(sourceStreamId.toString())
            };

            const result = await collection.findOne(query);
            await client.close();
            return result;
        } catch (ex) {
            return undefined;
        }
    }

    async dump(destination: string): Promise<string[]> {
        const backups: string[] = [];
        for (const eventStoreForTenant of this.microservice.configuration.eventStoreForTenants) {
            const destinationFile = path.join(destination, `backup-for-tenant-${eventStoreForTenant.tenantId}.gz`);
            backups.push(destinationFile);
            const targetStream = fs.createWriteStream(destinationFile) as any as WritableStream;

            await this.microservice.eventStoreStorage.exec([
                'mongodump',
                '--quiet',
                '--archive',
                '--gzip',
                '-d',
                eventStoreForTenant.database
            ], undefined, targetStream,
            {});
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
            // const result = await collection.find().toArray();
            await client.close();
            return result;
        }
        catch (ex) {
            console.error(ex);
            return [];
        }
    }

    private async getMongoClient() {
        return await MongoClient.connect(this._url, this._options);
    }
}
