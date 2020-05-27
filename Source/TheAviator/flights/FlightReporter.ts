// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IFlightReporter } from './IFlightReporter';
import { ScenarioResult } from './reporting';
import { Flight } from './Flight';
import { Scenario, ScenarioEnvironment, RunState, BecauseOf } from '../gherkin';

import chalk from 'chalk';
import { merge, Observable } from 'rxjs';
import { Transform, TransformCallback } from 'stream';
import { Console } from 'console';

class NewlineCountingStream extends Transform {
    newlines: number = 0;

    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
        const chunkNewlines = (chunk.toString().match(/\n/g) || []).length as number;
        this.newlines += chunkNewlines;
        this.push(chunk, encoding);
        callback();
    }
}

class NewlineCounter {
    readonly _stream: NewlineCountingStream;

    constructor() {
        this._stream = new NewlineCountingStream();
        this._stream.pipe(process.stdout);
    }

    get console(): Console {
        return new Console(this._stream);
    }

    get newlines(): number {
        return this._stream.newlines;
    }

    destroy() {
        this._stream.unpipe()
        this._stream.destroy();
    }
}

type OverwritingConsoleRendererCallback = (console: Console) => void;

class OverwritingConsoleRenderer {
    _previousLines: number = 0;
    readonly _callback: OverwritingConsoleRendererCallback;

    constructor(callback: OverwritingConsoleRendererCallback) {
        this._callback = callback;
    }

    subscribeTo(...observables: Observable<any>[]) {
        this.render();
        merge(...observables).subscribe(() => {
            this.render();
        });
    }
    
    private render() {
        process.stdout.write(`\x1B[${this._previousLines}A`);
        const counter = new NewlineCounter();
        this._callback(counter.console);
        this._previousLines = counter.newlines;
        counter.destroy();
    }
}

export class FlightReporter implements IFlightReporter {
    observe(flight: Flight): void {
        flight.scenario.subscribe(scenario => this.outputScenario(scenario));
        flight.environment.subscribe(environment => this.outputEnvironment(environment));
        flight.recorder.scenarioResult.subscribe(result => this.outputScenarioResult(result));
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

        const renderer = new OverwritingConsoleRenderer((console) => {
            console.log('\n');
            console.log(`Given: ${chalk.bold(scenario.contextName)}\n`);
            console.log(`Feature: ${chalk.bold(scenario.specification.feature.name)}\n`);
            console.log(`Scenario: ${chalk.bold(scenario.name)}`);
            console.log(` ${this.becauseOfStatusIcon(scenario.specification.when)} when ${scenario.specification.when.name}`);

            for (const and of scenario.specification.ands) {
                console.log(` ${this.becauseOfStatusIcon(and)} ${chalk.italic('and')} ${and.name}`);
            }
        });
        renderer.subscribeTo(scenario.specification.when.status.state, ...scenario.specification.ands.map(_ => _.status.state));
    }

    private becauseOfStatusIcon(becauseOf: BecauseOf): string {
        return becauseOf.status.state.value == RunState.Completed ? '✔' : ' ';
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
