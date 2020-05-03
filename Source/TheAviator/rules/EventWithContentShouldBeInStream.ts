// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { retry } from 'async';
import { Guid } from '@dolittle/rudiments';

import { IRule, IRuleContext, Reason } from '@dolittle/rules';
import { ScenarioWithThenSubject } from './ScenarioWithThenSubject';

const EventIsMissing: Reason = Reason.create('ffa82a7b-4dd3-49df-8ab0-08970f7508cc', 'Event is missing');
const EventsAreMissing: Reason = Reason.create('7198d144-f90c-4089-9035-53558f9d0479', 'Events are missing - looked for {desired}, found {actual}');

export class EventWithContentShouldBeInStream implements IRule<ScenarioWithThenSubject> {
    private _stream: string;
    private _events: any[];

    constructor(private _tenantId: Guid, stream: string, ...events: any[]) {
        this._stream = stream;
        this._events = [].concat(...events);
    }

    async evaluate(context: IRuleContext, subject: ScenarioWithThenSubject) {
        const eventsToLookFor: any[] = this._events.map(_ => {
            return { 'Content.uniqueIdentifier': _.uniqueIdentifier };
        });

        let eventsFound = 0;

        try {
            await retry({ times: 10, interval: 200 }, async (callback, results) => {
                const result = await subject.microservice.eventStore.findEvents(this._tenantId, this._stream, { $or: eventsToLookFor });
                eventsFound = result.length;
                if (result.length !== this._events.length) {
                    callback(new Error('No event found'));
                } else {
                    callback(null);
                }
            });
        } catch (ex) {
            if (eventsToLookFor.length === 1) {
                context.fail(this, subject, EventIsMissing.noArguments());
            } else {
                context.fail(this, subject, EventsAreMissing.withArguments({ desired: eventsToLookFor.length, actual: eventsFound }));
            }
        }
    }
}
