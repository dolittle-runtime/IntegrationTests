// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { BehaviorSubject } from 'rxjs';

import { FlightPlan } from './FlightPlan';
import { IFlightRecorder } from './IFlightRecorder';
import { IFlightPaths } from './IFlightPaths';

import { Scenario, NoScenario, ScenarioContext } from '../gherkin';

export class Flight {
    private _recorder: IFlightRecorder | undefined;
    readonly plan: FlightPlan;
    readonly platform: string;

    readonly scenarioContext: BehaviorSubject<ScenarioContext>;
    readonly scenario: BehaviorSubject<Scenario>;

    constructor(platform: string, plan: FlightPlan) {
        this.platform = platform;
        this.plan = plan;

        this.scenarioContext = new BehaviorSubject<ScenarioContext>(new ScenarioContext('NoScenarioContext', {}));
        this.scenario = new BehaviorSubject<Scenario>(new NoScenario());
    }

    get paths(): IFlightPaths {
        return this.plan.paths;
    }

    get recorder(): IFlightRecorder {
        if (this._recorder) {
            return this._recorder;
        }
        throw new Error('Flight recorder is not configured for flight');
    }

    setRecorder(recorder: IFlightRecorder) {
        this._recorder = recorder;
    }
}
