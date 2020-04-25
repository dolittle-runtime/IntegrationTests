// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '../Constructor';

import { IGiven, NoContext } from '../gherkin';

import { IMicroserviceFactory } from '../microservices';

import { Scenario, ScenarioContextDefinition } from '../gherkin';

import { IFlightPlanner } from './IFlightPlanner';
import { FlightPlan } from './FlightPlan';
import { IFlightPaths } from './IFlightPaths';

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');

export class FlightPlanner implements IFlightPlanner {

    constructor(private _flightPaths: IFlightPaths, private _microserviceFactory: IMicroserviceFactory) {
    }

    planFor(platform: string, ...scenarios: Constructor<Scenario>[]): FlightPlan {
        const scenariosByGiven: Map<Constructor<IGiven>, Scenario[]> = new Map();
        const scenarioContexts: Map<Constructor<IGiven>, ScenarioContextDefinition> = new Map();
        const scenariosByContexts: Map<ScenarioContextDefinition, Scenario[]> = new Map();

        for (const scenarioConstructor of scenarios) {
            const scenario = new scenarioConstructor() as Scenario;
            scenario.prepare();

            let givenConstructor = scenario.given;
            if (!givenConstructor) {
                givenConstructor = NoContext;
            }

            let scenarioContext: ScenarioContextDefinition;
            if (!scenariosByGiven.has(givenConstructor)) {
                const given = new givenConstructor();
                scenariosByGiven.set(givenConstructor, []);
                scenarioContext = new ScenarioContextDefinition(givenConstructor.name);
                given.describe(scenarioContext);
                scenarioContexts.set(givenConstructor, scenarioContext);
            } else {
                scenarioContext = scenarioContexts.get(givenConstructor) ?? new ScenarioContextDefinition(givenConstructor.name);
            }

            scenariosByGiven.get(givenConstructor)?.push(scenario);
            if (!scenariosByContexts.has(scenarioContext)) {
                scenariosByContexts.set(scenarioContext, []);
            }

            scenariosByContexts.get(scenarioContext)?.push(scenario);
        }

        return new FlightPlan(this._flightPaths, scenariosByContexts);
    }
}
