// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario } from '../gherkin/Scenario';
import { FlightPlan } from './FlightPlan';
import { Constructor } from '../Constructor';

export interface IFlightPlanner {
    planFor(target: string, ...scenarios: Constructor<Scenario>[]): FlightPlan
}
