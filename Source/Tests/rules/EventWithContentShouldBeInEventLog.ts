// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IRule, IRuleContext, Reason } from '@dolittle/rules';
import { EventLogQuerySubject } from './EventLogSubject';

const EventIsMissing: Reason = Reason.create('ffa82a7b-4dd3-49df-8ab0-08970f7508cc', 'Event is missing');

export class EventWithContentShouldBeInEventLog implements IRule<EventLogQuerySubject> {
    private _events: any[];

    constructor(...events: any[]) {
        this._events = [].concat(...events);
    }

    async evaluate(context: IRuleContext, subject: EventLogQuerySubject) {
        console.log('Evaluate');
        const eventsToLookFor: any[] = this._events.map(_ => {
            return { 'Content.uniqueIdentifier': _.uniqueIdentifier };
        });
        const result = await subject.microservice.findDocumentsInEventStore('event-log', { $or: eventsToLookFor });
        if (result.length !== this._events.length) {
            context.fail(this, subject, EventIsMissing.noArguments());
        }
    }
}
