// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { BehaviorSubject } from "rxjs";

export enum RunState {
    None = 'none',
    Queued = 'queued',
    Running = 'running',
    Completed = 'completed'
}

export class RunStatus {
    _state : BehaviorSubject<RunState>;
    _started? : Date;
    _completed? : Date;
    _duration : BehaviorSubject<number>;
    _timer? : NodeJS.Timeout;

    constructor() {
        this._state = new BehaviorSubject<RunState>(RunState.None);
        this._duration = new BehaviorSubject<number>(0);
    }

    get state(): BehaviorSubject<RunState> {
        return this._state;
    }

    queued() {
        this._state.next(RunState.Queued);
    }

    running() {
        this._state.next(RunState.Running);
        this._started = new Date();
        this._timer = setInterval(() => {
            const milliseconds = new Date().valueOf() - this._started!.valueOf();
            this._duration.next(milliseconds/1000);
        }, 100);
    }

    completed() {
        this._state.next(RunState.Completed);
        this._state.complete();
        this._completed = new Date();
        clearInterval(this._timer!);
        const milliseconds = this._completed!.valueOf() - this._started!.valueOf();
        this._duration.next(milliseconds/1000);
        this._duration.complete();
    }
}
