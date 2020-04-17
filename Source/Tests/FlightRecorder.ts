// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Flight } from './Flight';
import { IFlightRecorder } from './IFlightRecorder';

export class FlightRecorder implements IFlightRecorder {
    recordFor(flight: Flight): void {
        throw new Error('Method not implemented.');
    }
}
