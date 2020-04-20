// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { RuleSetContainerBuilder, RuleSetBuilder, IRule } from '@dolittle/rules';
import { EventWithContentShouldBeInEventLog } from './EventWithContentShouldBeInEventLog';
import { EventLogRuleBuilder } from './EventLogRuleBuilder';
import { Microservice } from '../Microservice';
import { Constructor } from '../Constructor';

export class EventLogRuleSetContainerBuilder extends RuleSetContainerBuilder {
    private _ruleSetBuilder: RuleSetBuilder;

    constructor(private _microservice: Microservice) {
        super();
        this._ruleSetBuilder = new RuleSetBuilder();
        this.addRuleSetBuilder(this._ruleSetBuilder);
    }

    should_contain = (...events: any[]) => this.addRuleBuilderFor(new EventWithContentShouldBeInEventLog(events));

    private addRuleBuilderFor(rule: IRule) {
        this._ruleSetBuilder.addRuleBuilder(new EventLogRuleBuilder(this._microservice, rule));
    }
}
