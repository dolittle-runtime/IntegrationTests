// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { FlightPlan } from './FlightPlan';

export interface IFlightControl {
    takeOff(flightPlan: FlightPlan): Promise<void>;
}
