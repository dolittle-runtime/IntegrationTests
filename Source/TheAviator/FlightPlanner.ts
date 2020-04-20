// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as fs from 'fs';
import * as path from 'path';

import { Scenario } from './Scenario';
import { FlightPlan } from './FlightPlan';
import { Constructor } from './Constructor';
import { IFlightPlanner } from './IFlightPlanner';
import { IGiven } from './IGiven';
import { NoContext } from './NoContext';
import { IMicroserviceFactory } from './IMicroserviceFactory';
import { ScenarioContext } from './ScenarioContext';

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');

export class FlightPlanner implements IFlightPlanner {

    constructor(private _microserviceFactory: IMicroserviceFactory) {
    }

    planFor(target: string, ...scenarios: Constructor<Scenario>[]): FlightPlan {
        const currentDate = new Date();
        const currentDateString = `${currentDate.getFullYear()}-${zeroPad(currentDate.getMonth(), 2)}-${zeroPad(currentDate.getDate(), 2)} ${zeroPad(currentDate.getHours(), 2)}_${zeroPad(currentDate.getMinutes(), 2)}_${zeroPad(currentDate.getSeconds(), 2)}`;
        const workingDirectory = path.join(process.cwd(), 'results', currentDateString);
        if (!fs.existsSync(workingDirectory)) {
            fs.mkdirSync(workingDirectory, { recursive: true });
        }

        const scenariosByGiven: Map<Constructor<IGiven>, Scenario[]> = new Map();
        const scenarioContexts: Map<Constructor<IGiven>, ScenarioContext> = new Map();
        const scenariosByContexts: Map<ScenarioContext, Scenario[]> = new Map();

        for (const scenarioConstructor of scenarios) {
            const scenario = new scenarioConstructor() as Scenario;
            let givenConstructor = scenario.given;
            if (!givenConstructor) {
                givenConstructor = NoContext;
            }

            let scenarioContext: ScenarioContext;
            if (!scenariosByGiven.has(givenConstructor)) {
                const given = new givenConstructor();
                scenariosByGiven.set(givenConstructor, []);
                scenarioContext = new ScenarioContext(givenConstructor.name, this._microserviceFactory, workingDirectory, target);
                given.describe(scenarioContext);
                scenarioContexts.set(givenConstructor, scenarioContext);
            } else {
                scenarioContext = scenarioContexts.get(givenConstructor) ?? new ScenarioContext(givenConstructor.name, this._microserviceFactory, workingDirectory, target);
            }

            scenariosByGiven.get(givenConstructor)?.push(scenario);
            if (!scenariosByContexts.has(scenarioContext)) {
                scenariosByContexts.set(scenarioContext, []);
            }

            scenariosByContexts.get(scenarioContext)?.push(scenario);
        }

        return new FlightPlan(workingDirectory, scenariosByContexts);
    }
}
