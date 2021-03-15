// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IContainer, LogMessageWaitStrategy, IContainerEnvironment } from '../containers';

import { IMicroserviceActions } from './IMicroserviceActions';
import { MicroserviceActions } from './MicroserviceActions';
import { MicroserviceConfiguration } from './configuration/MicroserviceConfiguration';
import { IEventStore, EventStore } from '../eventStores';
import { RuntimeActions } from './runtime/RuntimeActions';
import { HeadActions } from './head/HeadActions';

export class Microservice {
    readonly configuration: MicroserviceConfiguration;
    readonly head: IContainer;
    readonly runtime: IContainer;
    readonly eventStoreStorage: IContainer;
    readonly actions: IMicroserviceActions;
    readonly eventStore: IEventStore;

    constructor(
        configuration: MicroserviceConfiguration,
        private _containerEnvironment: IContainerEnvironment,
        head: IContainer,
        runtime: IContainer,
        eventStoreStorage: IContainer) {

        this.configuration = configuration;
    
        this.head = head;
        this.runtime = runtime;
        this.eventStoreStorage = eventStoreStorage;
        this.actions = new MicroserviceActions(new RuntimeActions(this), new HeadActions(this));
        this.eventStore = new EventStore(this);
    }

    async start() {
        await this.eventStoreStorage.start(new LogMessageWaitStrategy('waiting for connections on port 27017'));
        await this.runtime.start(new LogMessageWaitStrategy('Application started.'));
        await this.head.start(new LogMessageWaitStrategy('Connected to runtime'));
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
        await this.head.kill();
        await this.runtime.kill();
        await this.eventStoreStorage.kill();

        await this._containerEnvironment.removeNetwork(this.configuration.networkName);
    }

    async connectToProducer(producer: Microservice) {
        await this.head.connectToNetwork(producer.configuration.networkName);
        await this.runtime.connectToNetwork(producer.configuration.networkName);
        await this.eventStoreStorage.connectToNetwork(producer.configuration.networkName);
    }

    async disconnectFromProducer(producer: Microservice) {
        await this.head.disconnectFromNetwork(producer.configuration.networkName);
        await this.runtime.disconnectFromNetwork(producer.configuration.networkName);
        await this.eventStoreStorage.disconnectFromNetwork(producer.configuration.networkName);
    }
}
