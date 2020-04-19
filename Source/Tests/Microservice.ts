// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { RuleSetContainerEvaluation } from '@dolittle/rules';

import { IContainer } from './IContainer';
import { EventLogRuleSetContainerBuilder } from './rules/EventLogRuleSetContainerBuilder';
import { IMicroserviceActions } from './IMicroserviceActions';
import { MicroserviceActions } from './MicroserviceActions';

export class Microservice {
    readonly name: string;
    readonly head: IContainer;
    readonly runtime: IContainer;
    readonly eventStoreStorage: IContainer;
    readonly uniqueIdentifier: Guid;
    readonly actions: IMicroserviceActions;

    event_log: EventLogRuleSetContainerBuilder | undefined;
    eventLogEvaluation: RuleSetContainerEvaluation | undefined;

    constructor(uniqueIdentifier: Guid, name: string, head: IContainer, runtime: IContainer, eventStoreStorage: IContainer) {
        this.uniqueIdentifier = uniqueIdentifier;
        this.name = name;
        this.head = head;
        this.runtime = runtime;
        this.eventStoreStorage = eventStoreStorage;
        this.actions = new MicroserviceActions(this);
    }

    async start() {
        console.log(`Start containers for '${this.name}'`);
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
        console.log(`Kill containers for '${this.name}'`);
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
}
