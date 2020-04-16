// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IContainer } from './IContainer';

export class Microservice {
    readonly head: IContainer;
    readonly runtime: IContainer;
    readonly eventStore: IContainer;

    constructor(head: IContainer, runtime: IContainer, eventStore: IContainer) {
        this.head = head;
        this.runtime = runtime;
        this.eventStore = eventStore;
    }

    async start() {
        await this.eventStore.start();
        await this.runtime.start();
        await this.eventStore.start();
    }
}
