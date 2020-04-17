// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IMicroserviceFactory } from './IMicroserviceFactory';
import { IFlightRecorder } from './IFlightRecorder';
import { FlightPlan } from './FlightPlan';
import { Flight } from './Flight';
import { IFlightControl } from './IFlightControl';

export class FlightControl implements IFlightControl {
    constructor(private _microserviceFactory: IMicroserviceFactory, private _flightRecorder: IFlightRecorder) {
    }

    takeOffWith(flightPlan: FlightPlan): Flight {
        throw new Error('Not implemented');
    }
}


