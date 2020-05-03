// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioContext } from '../../gherkin';
import { FlightSimulationOptions } from './FlightSimulationOptions';
import { IFlightSimulationProcedure } from './IFlightSimulationProcedure';
import { FlightSimulationPlan } from './FlightSimulationPlan';

export interface IFlightSimulationPlanner {
    createPlanFor<T extends ScenarioContext>(platform: string, options: FlightSimulationOptions, procedure: IFlightSimulationProcedure<T>): Promise<FlightSimulationPlan>;
}

