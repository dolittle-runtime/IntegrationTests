// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IRule, IRuleContext, Reason } from '@dolittle/rules';
import { EventLogSubject } from './EventLogSubject';

const EventIsMissing: Reason = Reason.create('ffa82a7b-4dd3-49df-8ab0-08970f7508cc', 'Event is missing');

export class EventWithContentShouldBeInEventLog implements IRule<EventLogSubject> {

    async evaluate(context: IRuleContext, subject: EventLogSubject) {
        context.fail(this, subject, EventIsMissing.noArguments());
    }
}
