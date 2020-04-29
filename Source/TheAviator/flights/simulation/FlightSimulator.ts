// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IGiven } from 'gherkin';

import { IFlightSimulator } from './IFlightSimulator';
import { FlightSimulationOptions } from './FlightSimulationOptions';
import { IFlightSimulationProcedure } from './IFlightSimulationProcedure';
import { FlightSimulation } from './FlightSimulation';

export class FlightSimulator implements IFlightSimulator {
    startFor<T extends IGiven>(options: FlightSimulationOptions, procedure: IFlightSimulationProcedure<T>): Promise<FlightSimulation> {
        throw new Error('Method not implemented.');
    }
}
