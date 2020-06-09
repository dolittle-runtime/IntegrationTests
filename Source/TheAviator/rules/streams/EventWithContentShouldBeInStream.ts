// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { retry } from 'async';
import { Guid } from '@dolittle/rudiments';
import { IRule, IRuleContext, Reason } from '@dolittle/rules';

import { ScenarioWithThenSubject } from '../ScenarioWithThenSubject';
import { EventObject } from '../../tests/shared/EventObject';
import { EventIsMissing, EventsAreMissing } from './rules';

export class EventWithContentShouldBeInStream implements IRule<ScenarioWithThenSubject> {
    private readonly _events: EventObject[];
    private readonly _expectedNumberOfEvents: number;

    constructor(private readonly _tenantId: Guid, private readonly _stream: string, ...events: EventObject[]) {
        this._events = [...events];
        this._expectedNumberOfEvents = events.length;
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
                if (eventsFound !== this._expectedNumberOfEvents) {
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
