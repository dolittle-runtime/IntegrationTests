// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { RuleSetContainerEvaluation } from '@dolittle/rules';

import { EventLogRuleSetContainerBuilder } from '../rules/EventLogRuleSetContainerBuilder';

import { IContainer, LogMessageWaitStrategy } from '../containers';

import { IMicroserviceActions } from './IMicroserviceActions';
import { MicroserviceActions } from './MicroserviceActions';
import { MicroserviceConfiguration } from './configuration/MicroserviceConfiguration';


import { MongoClient, FilterQuery } from 'mongodb';

export class Microservice {
    readonly configuration: MicroserviceConfiguration;
    readonly head: IContainer;
    readonly runtime: IContainer;
    readonly eventStoreStorage: IContainer;
    readonly actions: IMicroserviceActions;

    event_log: EventLogRuleSetContainerBuilder | undefined;
    eventLogEvaluation: RuleSetContainerEvaluation | undefined;

    constructor(
        configuration: MicroserviceConfiguration,
        head: IContainer,
        runtime: IContainer,
        eventStoreStorage: IContainer) {

        this.configuration = configuration;
        this.head = head;
        this.runtime = runtime;
        this.eventStoreStorage = eventStoreStorage;
        this.actions = new MicroserviceActions(this);
    }

    async start() {
        //this.head.outputStream.pipe(process.stdout);
        //this.runtime.outputStream.pipe(process.stdout);
        //this.eventStoreStorage.outputStream.pipe(process.stdout);

        console.log('Starting event store storage');
        await this.eventStoreStorage.start(new LogMessageWaitStrategy('waiting for connections on port 27017'));
        console.log('Starting Runtime');
        await this.runtime.start(new LogMessageWaitStrategy('Application started.'));
        console.log('Starting Head');
        await this.head.start(new LogMessageWaitStrategy('Connected to runtime'));
        console.log('All containers started');
    }

    async stop() {
        await this.head.stop();
        await this.runtime.stop();
        await this.eventStoreStorage.stop();
    }

    async restart() {
        await this.head.restart();
        await this.runtime.restart();
        await this.eventStoreStorage.restart();
    }

    async kill() {
        console.log(`Kill containers for '${this.configuration.name}'`);

        await this.head.kill();
        await this.runtime.kill();
        await this.eventStoreStorage.kill();
    }

    async clearEventStore() {
    }

    async beginEvaluation() {
        this.event_log = new EventLogRuleSetContainerBuilder(this);
    }

    async endEvaluation() {
        if (this.event_log) {
            const eventLogRuleSetContainer = this.event_log.build();
            this.eventLogEvaluation = new RuleSetContainerEvaluation(eventLogRuleSetContainer);
            await this.eventLogEvaluation.evaluate(this);
        }
    }

    async getMongoClientForEventStoreStorage() {
        const url = `mongodb://localhost:${this.eventStoreStorage.boundPorts.get(27017)}`;
        const client = await MongoClient.connect(url, { useUnifiedTopology: true });
        return client;
    }

    async findDocumentsInEventStore(collectionName: string, filter: FilterQuery<any>): Promise<any[]> {
        try {
            const client = await this.getMongoClientForEventStoreStorage();
            const collection = client.db('event_store').collection(collectionName);
            const result = await collection.find(filter).toArray();
            await client.close();
            return result;
        } catch (ex) {
            return [];
        }
    }
}
