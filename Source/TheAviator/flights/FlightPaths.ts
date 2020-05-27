// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as fs from 'fs';
import * as path from 'path';

import { Scenario, ScenarioEnvironmentDefinition } from '../gherkin';
import { Microservice } from '../microservices';

import { IFlightPaths } from './IFlightPaths';

import zeroPad from '../zeroPad';

/**
 * Represents an implementation of {IFlightPaths}
 */
export class FlightPaths implements IFlightPaths {
    readonly base: string;
    readonly global: string;

    /**
     * Initializes a new instance of {FlightPaths}.
     */
    constructor() {
        const currentDate = new Date();
        const currentDateString = `${currentDate.getFullYear()}-${zeroPad(currentDate.getMonth() + 1, 2)}-${zeroPad(currentDate.getDate(), 2)} ${zeroPad(currentDate.getHours(), 2)}_${zeroPad(currentDate.getMinutes(), 2)}_${zeroPad(currentDate.getSeconds(), 2)}`;
        this.base = path.join(process.cwd(), 'resultOutput', currentDateString);
        this.ensureDirectory(this.base);
        this.global = path.join(this.base, '_global');
        this.ensureDirectory(this.global);
    }

    /** @inheritdoc */
    forScenarioContext(scenario: Scenario): string {
        const directory = path.join(this.base, scenario.contextName);
        this.ensureDirectory(directory);
        return directory;
    }

    /** @inheritdoc */
    forScenario(scenario: Scenario): string {
        const directory = path.join(this.base, scenario.contextName, scenario.name);
        this.ensureDirectory(directory);
        return directory;
    }

    /** @inheritdoc */
    forMicroservice(microservice: Microservice): string {
        const directory = path.join(this.base, '_microservices', microservice.configuration.name);
        this.ensureDirectory(directory);
        return directory;
    }

    /** @inheritdoc */
    forMicroserviceInScenario(scenario: Scenario, microservice: Microservice): string {
        const scenarioDirectory = this.forScenario(scenario);
        const directory = path.join(scenarioDirectory, '_microservices', microservice.configuration.name);
        this.ensureDirectory(directory);
        return directory;
    }

    /** @inheritdoc */
    forMicroserviceInContext(scenario: Scenario, microservice: Microservice): string {
        const scenarioDirectory = this.forScenarioContext(scenario);
        const directory = path.join(scenarioDirectory, '_microservices', microservice.configuration.name);
        this.ensureDirectory(directory);
        return directory;
    }

    private ensureDirectory(directory: string) {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }
}
