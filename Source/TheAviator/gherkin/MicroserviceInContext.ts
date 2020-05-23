// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Microservice } from '../microservices/Microservice';
import { Tenants } from '../tests/shared/Tenants';
import { Artifacts } from '../tests/shared/Artifacts';

import {
    EventLogRuleSetContainerBuilder,
    StreamsRuleSetContainerBuilder,
    StreamProcessorRuleSetContainerBuilder,
    ScenarioRuleSetContainerBuilder
} from '../rules';

import { RuleSetContainerEvaluation, BrokenRule } from '@dolittle/rules';
import { IMicroserviceActions } from '../microservices';
import { IContainer } from '../containers';

export class MicroserviceInContext {
    readonly microservice: Microservice;
    readonly event_log: EventLogRuleSetContainerBuilder;
    readonly stream_processors: StreamProcessorRuleSetContainerBuilder;
    readonly streams: StreamsRuleSetContainerBuilder;

    constructor(microservice: Microservice) {
        this.microservice = microservice;
        this.event_log = new EventLogRuleSetContainerBuilder(this.microservice);
        this.stream_processors = new StreamProcessorRuleSetContainerBuilder(this.microservice);
        this.streams = new StreamsRuleSetContainerBuilder(this.microservice);
    }

    get head(): IContainer {
        return this.microservice.head;
    }

    get runtime(): IContainer {
        return this.microservice.runtime;
    }

    get eventStoreStorage(): IContainer {
        return this.microservice.eventStoreStorage;
    }

    get actions(): IMicroserviceActions {
        return this.microservice.actions;
    }

    async commitEvent(eventSource: Guid, event: any) {
        await this.microservice.actions.commitEvent(Tenants.tenant, eventSource, Artifacts.event, event);
    }

    async commitAggregateEventInFirst(eventSource: Guid, version: number, event: any) {
        await this.microservice.actions.commitAggregateEvent(Tenants.tenant, eventSource, version, Artifacts.aggregateEvent, event);
    }

    async commitPublicEvent(eventSource: Guid, event: any) {
        await this.microservice.actions.commitPublicEvent(Tenants.tenant, eventSource, Artifacts.event, event);
    }

    async evaluate(): Promise<BrokenRule[]> {
        let brokenRules: BrokenRule[] = [];

        brokenRules = brokenRules.concat(await this.evaluateAndGetBrokenRules(this.event_log));
        brokenRules = brokenRules.concat(await this.evaluateAndGetBrokenRules(this.stream_processors));
        brokenRules = brokenRules.concat(await this.evaluateAndGetBrokenRules(this.streams));

        return brokenRules;
    }

    private async evaluateAndGetBrokenRules(ruleSetContainerBuilder: ScenarioRuleSetContainerBuilder | undefined) {
        if (!ruleSetContainerBuilder) {
            return [];
        }
        const ruleSetContainer = ruleSetContainerBuilder.build();
        const evaluation = new RuleSetContainerEvaluation(ruleSetContainer);
        await evaluation.evaluate(this);
        return evaluation.brokenRules;
    }
}
