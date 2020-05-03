// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Duration } from 'moment';

export class FlightSimulationOptions {
    duration!: Duration;
    warmUpPeriod!: Duration;
    coolOffPeriod!: Duration;
    maximumSimultaneousActors: number = 1;
    minimumIntervalForBehaviors: number = 1000;
    maximumIntervalForBehaviors: number = 10000;
}
