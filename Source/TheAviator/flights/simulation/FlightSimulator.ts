// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ISpecificationRunner } from '../../gherkin';

import { IFlightSimulator } from './IFlightSimulator';
import { FlightSimulation } from './FlightSimulation';
import { FlightSimulationPlan } from './FlightSimulationPlan';

import chalk from 'chalk';

export class FlightSimulator implements IFlightSimulator {

    constructor(private _specificationRunner: ISpecificationRunner) {
    }

    async run(plan: FlightSimulationPlan): Promise<FlightSimulation> {
        const simulation = new FlightSimulation(plan, this._specificationRunner);

        console.log(`Run simulation plan that ends ${plan.options.duration.humanize(true)}`);

        await plan.environment.start();
        await simulation.start();

        setTimeout(() => {
            console.log('Stop simulation');
            simulation.stop();

            setTimeout(() => {
                console.log('Simulation is done');
                simulation.done();
                console.log('Stop environment');
                plan.environment.stop();
            }, plan.options.coolOffPeriod.asMilliseconds());

        }, plan.options.duration.asMilliseconds());

        return simulation;
    }
}
