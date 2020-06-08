// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.


import { RuleSetContainerEvaluation, BrokenRule } from '@dolittle/rules';
import { IMicroserviceActions, Microservice } from '../microservices';
import { IContainer } from '../containers';
import { StreamProcessorRuleSetContainerBuilder } from '../rules/streamProcessors';
import { EventLogRuleSetContainerBuilder, StreamsRuleSetContainerBuilder } from '../rules/streams';
import { ScenarioRuleSetContainerBuilder } from '../rules';

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
