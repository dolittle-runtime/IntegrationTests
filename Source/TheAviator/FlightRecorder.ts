// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as fs from 'fs';
import * as path from 'path';

import { RuleSetContainerEvaluation } from '@dolittle/rules';

import { Flight } from './Flight';
import { IFlightRecorder } from './IFlightRecorder';
import { Scenario } from './Scenario';
import { ISerializer } from './ISerializer';
import { Microservice } from './Microservice';
import { IContainer } from './IContainer';
import { FailedRule } from './FailedRule';
import { ScenarioSubject } from './rules/ScenarioSubject';
import { ScenarioResult } from './ScenarioResult';
import { ScenarioContext } from './ScenarioContext';

export class FlightRecorder implements IFlightRecorder {
    private _currentScenarioContext: ScenarioContext | undefined;
    private _currentScenario: Scenario | undefined;
    private _colorRemoverRegEx: RegExp;
    private _scenarioResultsPerMicroservice: Map<Microservice, ScenarioResult[]> = new Map();


    constructor(private _flight: Flight, private _serializer: ISerializer) {
        this._colorRemoverRegEx = /#[0-9a-f]{6}|#[0-9a-f]{3}/gi;
        this._colorRemoverRegEx.compile();
        this.writeFlightPlan();
        this.writeMicroservicesConfigurations();
        this.hookUpLogOutputFor();
    }

    conclude() {
        const result: any = {};

        for (const [microservice, results] of this._scenarioResultsPerMicroservice) {
            result[microservice.name] = results;
        }

        const json = this._serializer.toJSON(result);
        const resultFilePath = path.join(this._flight.plan.outputPath, 'results.json');
        fs.writeFileSync(resultFilePath, json);
    }

    setCurrentScenarioContext(scenarioContext: ScenarioContext): void {
        this._currentScenarioContext = scenarioContext;
    }

    setCurrentScenario(scenario: Scenario): void {
        this._currentScenario = scenario;
    }

    async reportResultFor(scenario: Scenario, microservice: Microservice, evaluation: RuleSetContainerEvaluation) {
        const failedRules: FailedRule[] = [];
        for (const brokenRule of evaluation.brokenRules) {
            const subject = brokenRule.subject as ScenarioSubject;
            const message = brokenRule.causes.map(_ => `${_.title} - ${_.description}`).join();
            failedRules.push(new FailedRule(brokenRule.rule.constructor.name, message, subject.then));
        }
        const scenarioResult = new ScenarioResult(scenario.name, scenario.given?.name ?? '[unknown]', failedRules);
        const currentScenarioPathPath = this.ensureCurrentScenarioPath(microservice, scenario.contextName);
        const resultFilePath = path.join(currentScenarioPathPath, 'result.json');
        const json = this._serializer.toJSON(scenarioResult);
        fs.writeFileSync(resultFilePath, json);

        if (!this._scenarioResultsPerMicroservice.has(microservice)) {
            this._scenarioResultsPerMicroservice.set(microservice, []);
        }
        this._scenarioResultsPerMicroservice.get(microservice)?.push(scenarioResult);

        const currentScenarioPath = this.ensureCurrentScenarioPath(microservice, scenario.contextName);
        const metricsFilePath = path.join(currentScenarioPath, 'metrics.txt');
        const metrics = await microservice.actions.getRuntimeMetrics();
        fs.writeFileSync(metricsFilePath, metrics);
    }

    private writeMicroservicesConfigurations() {
        for (const [context, scenarios] of this._flight.plan.scenariosByContexts) {
            context.microservices.forEach(microservice => {
                const microservicePath = this.ensureMicroservicePath(microservice, context.name);

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

    private hookUpLogOutputFor() {
        for (const [context, scenarios] of this._flight.plan.scenariosByContexts) {
            context.microservices.forEach(microservice => {
                microservice.head.outputStream.on('data', this.getOutputStreamWriterFor(microservice, microservice.head));
                microservice.runtime.outputStream.on('data', this.getOutputStreamWriterFor(microservice, microservice.runtime));
                microservice.eventStoreStorage.outputStream.on('data', this.getOutputStreamWriterFor(microservice, microservice.eventStoreStorage));
            });
        }
    }

    private getOutputStreamWriterFor(microservice: Microservice, container: IContainer) {
        return (data: Buffer) => {
            const filtered = data.filter(_ => (_ === 0xa || _ === 0xd) || _ >= 0x20 && (_ < 0x80 || _ >= 0xa0));

            const currentScenarioPath = this.ensureCurrentScenarioPath(microservice, this._currentScenarioContext?.name ?? 'UnknownScenarioContext');
            const currentContainerPath = path.join(currentScenarioPath, `${container.options.friendlyName}.log`);

            fs.appendFileSync(currentContainerPath, filtered);
        };
    }

    private writeFlightPlan() {
        let flattenedScenarios: Scenario[] = [];
        this._flight.plan.scenariosByContexts.forEach((scenarios) => flattenedScenarios = [...scenarios]);

        const flightPlanSerialized: any = {
            scenarios: flattenedScenarios.map((scenario: Scenario) => {
                return {
                    given: scenario.given?.name ?? 'No Context',
                    scenario: scenario.name
                };
            })
        };

        const serialized = this._serializer.toJSON(flightPlanSerialized);
        const outputFile = path.join(this._flight.plan.outputPath, 'flightplan.json');

        fs.writeFileSync(outputFile, serialized);
    }

    private ensureCurrentScenarioPath(microservice: Microservice, scenarioContext: string) {
        const microservicePath = this.ensureMicroservicePath(microservice, scenarioContext);
        const currentScenarioPath = path.join(microservicePath, this._currentScenario?.name ?? '_init');
        if (!fs.existsSync(currentScenarioPath)) {
            fs.mkdirSync(currentScenarioPath, { recursive: true });
        }
        return currentScenarioPath;
    }

    private ensureMicroservicePath(microservice: Microservice, scenarioContext: string): string {
        const microservicePath = path.join(this._flight.plan.outputPath, scenarioContext, microservice.name);
        if (!fs.existsSync(microservicePath)) {
            fs.mkdirSync(microservicePath, { recursive: true });
        }
        return microservicePath;
    }
}
