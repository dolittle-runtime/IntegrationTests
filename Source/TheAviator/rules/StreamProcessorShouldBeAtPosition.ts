// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { retry } from 'async';

import { Guid } from '@dolittle/rudiments';
import { IRule, IRuleContext, Reason } from '@dolittle/rules';
import { ScenarioWithThenSubject } from './ScenarioWithThenSubject';
import { StreamProcessorState } from '../eventStores';

const StreamProcessorPositionIsWrong: Reason = Reason.create('e0f79ec4-f059-4581-b03a-827d8be7c680', 'Expected position "{expectedPosition}" for processor "{processor}" got "{actualPosition}"');
const MissingStreamProcessorState: Reason = Reason.create('8b9ec965-77df-4be0-b173-0ec2976f2e95', 'No stream processor state for processor "{processor}"');

export class StreamProcessorShouldBeAtPosition implements IRule<ScenarioWithThenSubject> {
    constructor(private _tenantId: Guid, private _eventProcessorId: Guid, private _position: number) {
    }

    async evaluate(context: IRuleContext, subject: ScenarioWithThenSubject) {
        let state: StreamProcessorState | null = new StreamProcessorState(this._eventProcessorId, this._eventProcessorId);

        try {
            await retry({ times: 5, interval: 200 }, async (callback, results) => {
                state = await subject.microservice.eventStore.getStreamProcessorState(this._tenantId, this._eventProcessorId, this._eventProcessorId);
                if (!state) {
                    callback(new Error('No state'));
                } else {
                    callback(null);
                }
            });
        } catch (ex) {
            context.fail(this, subject, MissingStreamProcessorState.withArguments({
                processor: this._eventProcessorId.toString()
            }));
            return;
        }
        
        if (state) {
            if (state.position !== this._position) {
                context.fail(this, subject, StreamProcessorPositionIsWrong.withArguments({
                    expectedPosition: this._position,
                    actualPosition: state.position,
                    processor: this._eventProcessorId.toString()
                }));
            }
        }
    }
}
