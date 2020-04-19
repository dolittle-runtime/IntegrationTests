// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { RuleSetContainerBuilder, RuleSetBuilder } from '@dolittle/rules';
import { EventWithContentShouldBeInEventLog } from './EventWithContentShouldBeInEventLog';
import { EventLogRuleBuilder } from './EventLogRuleBuilder';

export class EventLogRuleSetContainerBuilder extends RuleSetContainerBuilder {
    private _ruleSetBuilder: RuleSetBuilder;

    constructor() {
        super();
        this._ruleSetBuilder = new RuleSetBuilder();
        this.addRuleSetBuilder(this._ruleSetBuilder);
    }

    should_contain() {
        const ruleBuilder = new EventLogRuleBuilder(EventWithContentShouldBeInEventLog);
        this._ruleSetBuilder.addRuleBuilder(ruleBuilder);
    }
}
