// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { RuleBuilder, RuleWithSubjectProvider, IRule } from '@dolittle/rules';
import { Constructor } from 'Constructor';
import { EventLogSubjectProvider } from './EventLogSubjectProvider';

export class EventLogRuleBuilder extends RuleBuilder {
    constructor(private _rule: Constructor<IRule>) {
        super();
    }

    build(): RuleWithSubjectProvider {
        const rule = new this._rule();
        return new RuleWithSubjectProvider(rule, new EventLogSubjectProvider());
    }
}
