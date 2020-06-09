// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { retry } from 'async';

import { Guid } from '@dolittle/rudiments';
import { IRule, IRuleContext } from '@dolittle/rules';
import { ScenarioWithThenSubject } from '../ScenarioWithThenSubject';
import { MissingStreamProcessorState, StreamProcessorPositionIsWrong } from './rules';

export class StreamProcessorShouldBeAtPosition implements IRule<ScenarioWithThenSubject> {
    constructor(private _tenantId: Guid, private _eventProcessorId: Guid, private _scopeId: Guid, private _position: number) {
    }

    async evaluate(context: IRuleContext, subject: ScenarioWithThenSubject) {
        let state: any;

        try {
            await retry({ times: 10, interval: 200 }, async (callback, results) => {
                state = await subject.microservice.eventStore.getStreamProcessorState(this._tenantId, this._eventProcessorId, this._scopeId, this._eventProcessorId);
                if (!state || Number.parseInt(state.Position, 10) !== this._position) {
                    callback(new Error('No state'));
                } else {
                    callback(null);
                }
            });
        } catch (ex) {
            if (!state) {
                context.fail(this, subject, MissingStreamProcessorState.withArguments({
                    processor: this._eventProcessorId.toString()
                }));
            } else {
                console.log(state);
                context.fail(this, subject, StreamProcessorPositionIsWrong.withArguments({
                    expectedPosition: this._position,
                    actualPosition: state.Position,
                    processor: this._eventProcessorId.toString()
                }));
            }
        }
    }
}
