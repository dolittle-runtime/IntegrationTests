// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { FlightSimulation } from './FlightSimulation';
import { FlightSimulationPlan } from './FlightSimulationPlan';

export interface IFlightSimulator {
    run(plan: FlightSimulationPlan): Promise<FlightSimulation>;
}
