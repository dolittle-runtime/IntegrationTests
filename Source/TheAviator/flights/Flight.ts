// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { FlightPlan } from './FlightPlan';
import { IFlightRecorder } from './IFlightRecorder';
import { IFlightPaths } from './IFlightPaths';

export class Flight {
    private _recorder: IFlightRecorder | undefined;
    readonly plan: FlightPlan;
    readonly platform: string;

    constructor(platform: string, plan: FlightPlan) {
        this.platform = platform;
        this.plan = plan;
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
