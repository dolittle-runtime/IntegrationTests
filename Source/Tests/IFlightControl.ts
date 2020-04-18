// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { FlightPlan } from './FlightPlan';
import { Flight } from './Flight';

export interface IFlightControl {
    takeOffWith(flightPlan: FlightPlan): Promise<Flight>;
}