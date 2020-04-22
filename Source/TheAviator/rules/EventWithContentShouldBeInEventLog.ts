// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { IRule, IRuleContext, Reason } from '@dolittle/rules';
import { ScenarioWithThenSubject } from './ScenarioWithThenSubject';

const EventIsMissing: Reason = Reason.create('ffa82a7b-4dd3-49df-8ab0-08970f7508cc', 'Event is missing');

export class EventWithContentShouldBeInEventLog implements IRule<ScenarioWithThenSubject> {
    private _events: any[];

    constructor(private _tenantId: Guid, ...events: any[]) {
        this._events = [].concat(...events);
    }

    async evaluate(context: IRuleContext, subject: ScenarioWithThenSubject) {
        const eventsToLookFor: any[] = this._events.map(_ => {
            return { 'Content.uniqueIdentifier': _.uniqueIdentifier };
        });
        const result = await subject.microservice.eventStore.findEvents(this._tenantId, { $or: eventsToLookFor });
        if (result.length !== this._events.length) {
            context.fail(this, subject, EventIsMissing.noArguments());
        }
    }
}
