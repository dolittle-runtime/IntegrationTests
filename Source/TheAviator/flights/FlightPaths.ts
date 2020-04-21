// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as fs from 'fs';
import * as path from 'path';

import { Scenario, ScenarioContext } from '../gherkin';
import { Microservice } from '../microservices';

import { IFlightPaths } from './IFlightPaths';

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');

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
        const currentDateString = `${currentDate.getFullYear()}-${zeroPad(currentDate.getMonth(), 2)}-${zeroPad(currentDate.getDate(), 2)} ${zeroPad(currentDate.getHours(), 2)}_${zeroPad(currentDate.getMinutes(), 2)}_${zeroPad(currentDate.getSeconds(), 2)}`;
        this.base = path.join(process.cwd(), 'resultOutput', currentDateString);
        this.ensureDirectory(this.base);
        this.global = path.join(this.base, '_global');
        this.ensureDirectory(this.global);
    }

    /** @inheritdoc */
    forScenarioContext(context: ScenarioContext): string {
        const directory = path.join(this.base, context.name);
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
    forMicroservice(scenario: Scenario, microservice: Microservice): string {
        const scenarioDirectory = this.forScenario(scenario);
        const directory = path.join(scenarioDirectory, '_microservices', microservice.configuration.name);
        this.ensureDirectory(directory);
        return directory;
    }

    /** @inheritdoc */
    forMicroserviceInContext(context: ScenarioContext, microservice: Microservice): string {
        const scenarioDirectory = this.forScenarioContext(context);
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
