// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { RuleSetContainerBuilder, RuleSetBuilder, IRule } from '@dolittle/rules';
import { ScenarioRuleBuilder } from './ScenarioRuleBuilder';
import { Microservice } from '../microservices/Microservice';

export class ScenarioRuleSetContainerBuilder extends RuleSetContainerBuilder {
    private _ruleSetBuilder: RuleSetBuilder;

    constructor(private _microservice: Microservice) {
        super();
        this._ruleSetBuilder = new RuleSetBuilder();
        this.addRuleSetBuilder(this._ruleSetBuilder);
    }

    protected addRuleBuilderFor(rule: IRule) {
        this._ruleSetBuilder.addRuleBuilder(new ScenarioRuleBuilder(this._microservice, rule));
    }
}
