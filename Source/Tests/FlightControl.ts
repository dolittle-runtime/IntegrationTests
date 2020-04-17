// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IMicroserviceFactory } from './IMicroserviceFactory';
import { IFlightRecorder } from './IFlightRecorder';
import { FlightPlan } from './FlightPlan';
import { Flight } from './Flight';

export class FlightControl {
    constructor(private _microserviceFactory: IMicroserviceFactory, private _flightRecorder: IFlightRecorder) {
    }

    takeOffWith(flightPlan: FlightPlan): Flight {
    }
}


