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

export class FlightPlanner implements IFlightPlanner {

    constructor(private _microserviceFactory: IMicroserviceFactory) {
    }

    planFor(target: string, ...scenarios: Constructor<Scenario>[]): FlightPlan {
        const workingDirectory = path.join(process.cwd(), 'tt');
        if (!fs.existsSync(workingDirectory)) {
            fs.mkdirSync(workingDirectory);
        }

        const scenariosByGiven: Map<Constructor<IGiven>, Scenario[]> = new Map();
        const scenarioContexts: Map<Constructor<IGiven>, ScenarioContext> = new Map();

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
                scenarioContext = new ScenarioContext(this._microserviceFactory, workingDirectory, target);
                given.describe(scenarioContext);
                scenarioContexts.set(givenConstructor, scenarioContext);
            } else {
                scenarioContext = scenarioContexts.get(givenConstructor) ?? new ScenarioContext(this._microserviceFactory, workingDirectory, target);
            }

            scenariosByGiven.get(givenConstructor)?.push(scenario);
        }

        let flattenedScenarios: Scenario[] = [];
        scenariosByGiven.forEach(_ => flattenedScenarios = [..._]);

        return new FlightPlan(workingDirectory, [...scenarioContexts.values()], flattenedScenarios);
    }
}
