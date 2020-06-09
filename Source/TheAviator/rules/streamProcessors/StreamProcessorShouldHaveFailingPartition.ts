// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { retry } from 'async';
import { Guid } from '@dolittle/rudiments';
import { IRule, IRuleContext } from '@dolittle/rules';

import { ScenarioWithThenSubject } from '../ScenarioWithThenSubject';
import { MissingStreamProcessorState, StreamProcessorIsNotFailing, StreamProcessorDoesNotHaveFailingPartition } from './rules';


export class StreamProcessorShouldHaveFailingPartition implements IRule<ScenarioWithThenSubject> {
    constructor(private _tenantId: Guid, private _eventProcessorId: Guid, private _scopeId: Guid, private _partitionId: Guid) {
    }

    async evaluate(context: IRuleContext, subject: ScenarioWithThenSubject) {
        let state: any;

        try {
            await retry({ times: 10, interval: 200 }, async (callback, results) => {
                state = await subject.microservice.eventStore.getStreamProcessorState(this._tenantId, this._eventProcessorId, this._scopeId, this._eventProcessorId);
                if (!state || !this.streamProcessorIsFailing(state) || !this.hasFailingPartition(state)) {
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
            } else if (!this.streamProcessorIsFailing(state)) {
                context.fail(this, subject, StreamProcessorIsNotFailing.withArguments({
                    processor: this._eventProcessorId.toString()
                }));
            } else {
                context.fail(this, subject, StreamProcessorDoesNotHaveFailingPartition.withArguments({
                    processor: this._eventProcessorId.toString(),
                    partition: this._partitionId
                }));
            }
        }
    }
    private streamProcessorIsFailing(streamProcessorState: any) {
        return streamProcessorState?.IsFailing
            || (streamProcessorState?.FailingPartitions && Object.keys(streamProcessorState?.FailingPartitions).length > 0);
    }
    private hasFailingPartition(state: any) {
        return state?.FailingPartitions && Object.keys(state?.FailingPartitions).includes(this._partitionId.toString());
    }
}
