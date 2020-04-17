// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IContainer } from './IContainer';

export class Microservice {
    readonly name: string;
    readonly head: IContainer;
    readonly runtime: IContainer;
    readonly eventStoreStorage: IContainer;

    constructor(name: string, head: IContainer, runtime: IContainer, eventStoreStorage: IContainer) {
        this.name = name;
        this.head = head;
        this.runtime = runtime;
        this.eventStoreStorage = eventStoreStorage;
    }

    async start() {
        await this.eventStoreStorage.start();
        await this.runtime.start();
        await this.head.start();
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
    }

    async clearEventStore() {
    }
}
