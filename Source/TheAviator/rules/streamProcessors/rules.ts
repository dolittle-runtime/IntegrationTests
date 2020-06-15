// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Reason } from '@dolittle/rules';

export const MissingStreamProcessorState: Reason = Reason.create('8b9ec965-77df-4be0-b173-0ec2976f2e95', 'No stream processor state for processor "{processor}"');
export const StreamProcessorPositionIsWrong: Reason = Reason.create('e0f79ec4-f059-4581-b03a-827d8be7c680', 'Expected position "{expectedPosition}" for processor "{processor}" got "{actualPosition}"');
export const StreamProcessorIsNotFailing: Reason = Reason.create('25f6e445-7f15-494e-9a29-54ce5c536a57', 'Expected processor "{processor}" to be failing');
export const StreamProcessorDoesNotHaveFailingPartition: Reason = Reason.create('aad9e921-889f-40a5-8a8d-c410682c8bb3', 'Expected processor "{processor}" to have failing partition "{partition}"');
