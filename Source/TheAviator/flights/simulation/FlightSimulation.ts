// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { FlightSimulationOptions } from './FlightSimulationOptions';
import { FlightSimulationPlan } from './FlightSimulationPlan';
import { FlightSimulationActor } from './FlightSimulationActor';
import { ISpecificationRunner } from '../../gherkin';

export class FlightSimulation {
    private _actors: FlightSimulationActor[] = [];

    constructor(private _plan: FlightSimulationPlan, private _specificationRunner: ISpecificationRunner) {
    }

    async start(): Promise<void> {
        const actor = new FlightSimulationActor(this._plan, this._specificationRunner);
        this._actors.push(actor);
        await actor.start();
    }

    async stop(): Promise<void> {
        for (const actor of this._actors) {
            await actor.stop();
        }
    }

    async done(): Promise<void> {

    }
}
