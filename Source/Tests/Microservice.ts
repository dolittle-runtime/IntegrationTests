// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IContainer } from './IContainer';
import { Guid } from '@dolittle/rudiments';
import { EventLogRuleSetContainerBuilder } from './rules/EventLogRuleSetContainerBuilder';
import { IMicroserviceActions } from './IMicroserviceActions';
import { RuleSetContainerEvaluation } from '@dolittle/rules';

export class Microservice {
    readonly name: string;
    readonly head: IContainer;
    readonly runtime: IContainer;
    readonly eventStoreStorage: IContainer;
    readonly uniqueIdentifier: Guid;

    readonly event_log: EventLogRuleSetContainerBuilder;

    constructor(uniqueIdentifier: Guid, name: string, head: IContainer, runtime: IContainer, eventStoreStorage: IContainer) {
        this.uniqueIdentifier = uniqueIdentifier;
        this.name = name;
        this.head = head;
        this.runtime = runtime;
        this.eventStoreStorage = eventStoreStorage;

        this.event_log = new EventLogRuleSetContainerBuilder();
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

    async evaluateRules() {
        const eventLogRuleSetContainer = this.event_log.build();
        const eventLogEvaluation = new RuleSetContainerEvaluation(eventLogRuleSetContainer);
        await eventLogEvaluation.evaluate(this);
    }
}
