// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { BehaviorSubject } from 'rxjs';

import { PreflightChecklist } from './PreflightChecklist';
import { IFlightRecorder } from './IFlightRecorder';
import { IFlightPaths } from './IFlightPaths';

import { Scenario, ScenarioEnvironment, ScenarioEnvironmentDefinition } from '../gherkin';

export class Flight {
    private _recorder: IFlightRecorder | undefined;
    readonly preflightChecklist: PreflightChecklist;
    readonly platform: string;

    readonly environment: BehaviorSubject<ScenarioEnvironment>;
    readonly scenario: BehaviorSubject<Scenario>;

    constructor(platform: string, preflightChecklist: PreflightChecklist) {
        this.platform = platform;
        this.preflightChecklist = preflightChecklist;

        this.environment = new BehaviorSubject<ScenarioEnvironment>(ScenarioEnvironment.empty);
        this.scenario = new BehaviorSubject<Scenario>(Scenario.none);
    }

    get paths(): IFlightPaths {
        return this.preflightChecklist.paths;
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
