// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario } from './Scenario';
import { FlightPlan } from './FlightPlan';
import { Constructor } from './Constructor';
import { IFlightPlanner } from './IFlightPlanner';
import { IGiven } from './IGiven';
import { NoContext } from './NoContext';
import { IMicroserviceFactory } from './IMicroserviceFactory';
import { ScenarioContext } from './ScenarioContext';
import { IFlightPaths } from './IFlightPaths';

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');

export class FlightPlanner implements IFlightPlanner {

    constructor(private _flightPaths: IFlightPaths, private _microserviceFactory: IMicroserviceFactory) {
    }

    planFor(platform: string, ...scenarios: Constructor<Scenario>[]): FlightPlan {
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
                scenarioContext = new ScenarioContext(givenConstructor.name, platform, this._flightPaths, this._microserviceFactory);
                given.describe(scenarioContext);
                scenarioContexts.set(givenConstructor, scenarioContext);
            } else {
                scenarioContext = scenarioContexts.get(givenConstructor) ?? new ScenarioContext(givenConstructor.name, platform, this._flightPaths, this._microserviceFactory);
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
