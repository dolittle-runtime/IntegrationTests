// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as fs from 'fs';
import * as path from 'path';

import { ISerializer } from '../ISerializer';

import { IContainer } from '../containers';
import { Microservice } from '../microservices';

import { Scenario, ScenarioResult, ScenarioContextDefinition, NoScenario } from '../gherkin';

import { FailedRule } from '../FailedRule';

import { Flight } from './Flight';
import { IFlightRecorder } from './IFlightRecorder';
import { FailedRuleCause } from '../FailedRuleCause';

export class FlightRecorder implements IFlightRecorder {
    private _currentScenario: Scenario;
    private _colorRemoverRegEx: RegExp;
    private _scenarioResultsPerContext: Map<ScenarioContextDefinition, ScenarioResult[]> = new Map();

    constructor(private _flight: Flight, private _serializer: ISerializer) {
        this._colorRemoverRegEx = /#[0-9a-f]{6}|#[0-9a-f]{3}/gi;
        this._colorRemoverRegEx.compile();
        this.writeFlightPlan();

        _flight.scenario.subscribe((scenario) => this._currentScenario = scenario);
        this._currentScenario = _flight.scenario.getValue();
    }

    conclude() {
        const result: any = {};

        for (const [context, results] of this._scenarioResultsPerContext) {
            result[context.name] = results;
        }

        const json = this._serializer.toJSON(result);
        const resultFilePath = path.join(this._flight.paths.base, 'results.json');
        fs.writeFileSync(resultFilePath, json);
    }

    async reportResultFor(scenario: Scenario, microservice: Microservice) {
        const thens: any = {};
        for (const then of scenario.thens) {
            thens[then.name] = then.brokenRules.map(brokenRule => {
                const causes = brokenRule.causes.map(cause => new FailedRuleCause(cause.title, cause.description));
                return new FailedRule(brokenRule.rule.constructor.name, causes);
            });
        }

        const scenarioResult = new ScenarioResult(scenario.name, scenario.given?.name ?? '[unknown]', thens);
        const currentScenarioPathPath = this._flight.paths.forScenario(scenario);
        const resultFilePath = path.join(currentScenarioPathPath, 'result.json');
        const json = this._serializer.toJSON(scenarioResult);
        fs.writeFileSync(resultFilePath, json);

        if (scenario.context) {
            if (!this._scenarioResultsPerContext.has(scenario.context.definition)) {
                this._scenarioResultsPerContext.set(scenario.context.definition, []);
            }
            this._scenarioResultsPerContext.get(scenario.context.definition)?.push(scenarioResult);
        }

        await this.writeMetricsForScenario(scenario, microservice);
    }

    writeConfigurationFilesFor(microservices: Microservice[]) {
        for (const [context, scenarios] of this._flight.plan.scenariosByContexts) {
            microservices.forEach(microservice => {
                const microservicePath = this._flight.paths.forMicroserviceInContext(context, microservice);

                const writeOptionsFile = (container: IContainer) => {
                    const containerOptionsFile = path.join(microservicePath, `${container.options.friendlyName}.json`);
                    const configOutput = JSON.parse(JSON.stringify(container.options));

                    configOutput.boundPorts = {};
                    for (const [k, v] of container.boundPorts) {
                        configOutput.boundPorts[k] = v;
                    }
                    fs.writeFileSync(containerOptionsFile, this._serializer.toJSON(configOutput));
                };

                writeOptionsFile(microservice.head);
                writeOptionsFile(microservice.runtime);
                writeOptionsFile(microservice.eventStoreStorage);
            });
        }
    }

    collectLogsFor(microservices: Microservice[]) {
        for (const [context, scenarios] of this._flight.plan.scenariosByContexts) {
            microservices.forEach(microservice => {
                microservice.head.outputStream.on('data', this.getOutputStreamWriterFor(microservice, microservice.head));
                microservice.runtime.outputStream.on('data', this.getOutputStreamWriterFor(microservice, microservice.runtime));
                microservice.eventStoreStorage.outputStream.on('data', this.getOutputStreamWriterFor(microservice, microservice.eventStoreStorage));
            });
        }
    }

    private async writeMetricsForScenario(scenario: Scenario, microservice: Microservice) {
        const currentScenarioPath = this._flight.paths.forMicroservice(scenario, microservice);
        const metricsFilePath = path.join(currentScenarioPath, 'metrics.txt');
        const metrics = await microservice.actions.getRuntimeMetrics();
        fs.writeFileSync(metricsFilePath, metrics);
    }

    private getOutputStreamWriterFor(microservice: Microservice, container: IContainer) {
        return (data: Buffer) => {
            const filtered = data.filter(_ => (_ === 0xa || _ === 0xd) || _ >= 0x20 && (_ < 0x80 || _ >= 0xa0));

            const currentScenarioPath = this._flight.paths.forMicroservice(this._currentScenario, microservice);
            const currentContainerPath = path.join(currentScenarioPath, `${container.options.friendlyName}.log`);

            fs.appendFileSync(currentContainerPath, filtered);
        };
    }

    private writeFlightPlan() {
        const flightPlan: any = {};

        for (const context of this._flight.plan.scenariosByContexts.keys()) {
            flightPlan[context.name] = this._flight.plan.scenariosByContexts.get(context)?.map((scenario: Scenario) => {
                return {
                    name: scenario.name,
                    thens: scenario.thens.map(_ => _.name)
                };
            });
        }

        const serialized = this._serializer.toJSON(flightPlan);
        const outputFile = path.join(this._flight.paths.base, 'flightplan.json');

        fs.writeFileSync(outputFile, serialized);
    }
}
