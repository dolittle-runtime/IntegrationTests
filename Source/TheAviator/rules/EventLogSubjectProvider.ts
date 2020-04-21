// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ISubjectProvider, IRuleContext } from '@dolittle/rules';
import { Microservice } from '../microservices/Microservice';
import { EventLogQuerySubject } from './EventLogSubject';

export class EventLogSubjectProvider implements ISubjectProvider {
    constructor(
        private _microservice: Microservice,
        private _scenario: string,
        private _then: string) {
    }

    provide(ruleContext: IRuleContext) {
        return new EventLogQuerySubject(this._microservice, this._scenario, this._then);
    }
}
