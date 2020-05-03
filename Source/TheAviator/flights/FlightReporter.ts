// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IFlightReporter } from './IFlightReporter';
import { ScenarioResult } from './reporting';
import { Flight } from './Flight';
import { Scenario, ScenarioEnvironment } from '../gherkin';

import chalk from 'chalk';

export class FlightReporter implements IFlightReporter {
    observe(flight: Flight): void {
        flight.scenario.subscribe(this.outputScenario);
        flight.environment.subscribe(this.outputEnvironment);
        flight.recorder.scenarioResult.subscribe(this.outputScenarioResult);
    }

    private outputEnvironment(environment: ScenarioEnvironment) {
        if (environment === ScenarioEnvironment.empty) {
            return;
        }

        console.log('\n');
        console.log('With Microservices:');
        for (const microserviceName of Object.keys(environment.microservices)) {
            console.log(`  ${chalk.bold(microserviceName)}`);
        }
    }

    private outputScenario(scenario: Scenario) {
        if (scenario === Scenario.none) {
            return;
        }

        console.log('\n');
        console.log(`Given: ${chalk.bold(scenario.contextName)}\n`);
        console.log(`Feature: ${chalk.bold(scenario.specification.feature.name)}\n`);
        console.log(`Scenario: ${chalk.bold(scenario.name)}`);
        console.log(`  when ${scenario.specification.when.name}`);

        for (const and of scenario.specification.ands) {
            console.log(`   ${chalk.italic('and')} ${and.name}`);
        }
    }

    private outputScenarioResult(scenarioResult: ScenarioResult) {

        for (const thenResult of scenarioResult.result.results) {
            const prefix = thenResult.brokenRules.length === 0 ? chalk.green('✔') : chalk.red('✗');
            console.log(`  ${prefix} ${chalk.reset('then')} ${thenResult.then}`);
            for (const brokenRule of thenResult.brokenRules) {
                for (const cause of brokenRule.causes) {
                    console.log(`      ${chalk.red(cause.title)}`);
                }
            }
        }
    }
}
