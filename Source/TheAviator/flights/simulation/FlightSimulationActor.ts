// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { FlightSimulationPlan } from './FlightSimulationPlan';
import { ISpecificationRunner } from '../../gherkin';

import chalk from 'chalk';

export class FlightSimulationActor {
    private _running: boolean = false;

    constructor(
        private _plan: FlightSimulationPlan,
        private _specificationRunner: ISpecificationRunner) {
    }

    async start(): Promise<void> {
        this._running = true;
        this.scheduleBehavior();
    }

    async stop(): Promise<void> {
        this._running = false;
    }

    private scheduleBehavior() {
        const nextTime = this.getTimeoutForNextBehavior();
        console.log(`Scheduled behavior in ${nextTime} milliseconds`);
        setTimeout(() => {
            if (!this._running) {
                return;
            }

            const scenario = this._plan.getRandomScenario();
            console.log(`Run ${scenario.name}`);
            this._specificationRunner.run(scenario.instance, scenario.specification).then(result => {
                for (const thenResult of result.results) {
                    const prefix = thenResult.brokenRules.length === 0 ? chalk.green('✔') : chalk.red('✗');
                    console.log(`  ${prefix} ${chalk.reset('then')} ${thenResult.then.name}`);
                    for (const brokenRule of thenResult.brokenRules) {
                        for (const cause of brokenRule.causes) {
                            console.log(`      ${chalk.red(cause.title)}`);
                        }
                    }
                }
            });

            if (this._running) {
                this.scheduleBehavior();
            }
        }, nextTime);
    }

    private getTimeoutForNextBehavior() {
        const intervalSpan = this._plan.options.maximumIntervalForBehaviors - this._plan.options.minimumIntervalForBehaviors;
        return Math.round((Math.random() * intervalSpan) + this._plan.options.minimumIntervalForBehaviors);
    }
}
