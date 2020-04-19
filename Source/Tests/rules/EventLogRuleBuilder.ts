// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { RuleBuilder, RuleWithSubjectProvider, IRule } from '@dolittle/rules';
import { Constructor } from 'Constructor';
import { EventLogSubjectProvider } from './EventLogSubjectProvider';
import { Microservice } from '../Microservice';

const stackTrace = require('stack-trace');

export class EventLogRuleBuilder extends RuleBuilder {
    private _then: string;
    private _scenario: string;

    constructor(private _microservice: Microservice, private _rule: Constructor<IRule>) {
        super();

        this._then = '[unknown]';
        this._scenario = '[unknown]';
        const callSites = stackTrace.get();
        for (const callSite of callSites) {
            const functionName = callSite.getFunctionName();
            if (functionName.indexOf('then_') === 0) {
                this._then = functionName;
                this._scenario = callSite.getTypeName();
                break;
            }
        }
    }

    build(): RuleWithSubjectProvider {
        const rule = new this._rule();
        return new RuleWithSubjectProvider(rule, new EventLogSubjectProvider(this._microservice, this._scenario, this._then));
    }
}
