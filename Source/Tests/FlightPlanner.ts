// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario } from './Scenario';
import { FlightPlan } from './FlightPlan';
import { Constructor } from './Constructor';
import { IFlightPlanner } from './IFlightPlanner';

export class FlightPlanner implements IFlightPlanner {
    planFor(...scenarios: Constructor<Scenario>[]): FlightPlan {
        for (const scenario of scenarios) {
        }
        throw new Error('Not implemented');
    }
}
