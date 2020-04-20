// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export class ScenarioSubject {
    readonly scenario: string;
    readonly then: string;

    constructor(scenario: string, then: string) {
        this.scenario = scenario;
        this.then = then;
    }
}
