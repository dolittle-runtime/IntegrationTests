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

export class FlightRecorder implements IFlightRecorder {
    private _currentScenario: Scenario | undefined;
    private _colorRemoverRegEx: RegExp;
    private _scenarioResultsPerMicroservice: Map<Microservice, ScenarioResult[]> = new Map();


    constructor(private _serializer: ISerializer) {
        this._colorRemoverRegEx = /#[0-9a-f]{6}|#[0-9a-f]{3}/gi;
        this._colorRemoverRegEx.compile();
    }

    recordFor(flight: Flight): void {
        this.writeFlightPlanFor(flight);
        this.writeMicroservicesConfigurations(flight);
        this.hookUpLogOutputFor(flight);
    }

    conclude(flight: Flight) {
        const result: any = {};

        for (const [microservice, results] of this._scenarioResultsPerMicroservice) {
            result[microservice.name] = results;
        }

        const json = this._serializer.toJSON(result);
        const resultFilePath = path.join(flight.flightPlan.outputPath, 'results.json');
        fs.writeFileSync(resultFilePath, json);
    }

    setCurrentScenario(scenario: Scenario): void {
        this._currentScenario = scenario;
    }

    async reportResultFor(flight: Flight, scenario: Scenario, microservice: Microservice, evaluation: RuleSetContainerEvaluation) {
        const failedRules: FailedRule[] = [];
        for (const brokenRule of evaluation.brokenRules) {
            const subject = brokenRule.subject as ScenarioSubject;
            const message = brokenRule.causes.map(_ => `${_.title} - ${_.description}`).join();
            failedRules.push(new FailedRule(brokenRule.rule.constructor.name, message, subject.then));
        }
        const scenarioResult = new ScenarioResult(scenario.name, scenario.given?.name ?? '[unknown]', failedRules);
        const microservicePath = this.ensureMicroservicePath(flight, microservice);
        const resultFilePath = path.join(microservicePath, 'result.json');
        const json = this._serializer.toJSON(scenarioResult);
        fs.writeFileSync(resultFilePath, json);

        if (!this._scenarioResultsPerMicroservice.has(microservice)) {
            this._scenarioResultsPerMicroservice.set(microservice, []);
        }
        this._scenarioResultsPerMicroservice.get(microservice)?.push(scenarioResult);

        const currentScenarioPath = this.ensureCurrentScenarioPath(flight, microservice);
        const metricsFilePath = path.join(currentScenarioPath, 'metrics.txt');
        const metrics = await microservice.actions.getRuntimeMetrics();
        fs.writeFileSync(metricsFilePath, metrics);
    }

    private writeMicroservicesConfigurations(flight: Flight) {
        for (const [context, scenarios] of flight.flightPlan.scenariosByContexts) {
            context.microservices.forEach(microservice => {
                const microservicePath = this.ensureMicroservicePath(flight, microservice);

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

    private hookUpLogOutputFor(flight: Flight) {
        for (const [context, scenarios] of flight.flightPlan.scenariosByContexts) {
            context.microservices.forEach(microservice => {
                microservice.head.outputStream.on('data', this.getOutputStreamWriterFor(flight, microservice, microservice.head));
                microservice.runtime.outputStream.on('data', this.getOutputStreamWriterFor(flight, microservice, microservice.runtime));
                microservice.eventStoreStorage.outputStream.on('data', this.getOutputStreamWriterFor(flight, microservice, microservice.eventStoreStorage));
            });
        }
    }

    private getOutputStreamWriterFor(flight: Flight, microservice: Microservice, container: IContainer) {
        return (data: Buffer) => {
            const filtered = data.filter(_ => (_ === 0xa || _ === 0xd) || _ >= 0x20 && (_ < 0x80 || _ >= 0xa0));

            const currentScenarioPath = this.ensureCurrentScenarioPath(flight, microservice);
            const currentContainerPath = path.join(currentScenarioPath, `${container.options.friendlyName}.log`);

            fs.appendFileSync(currentContainerPath, filtered);
        };
    }

    private writeFlightPlanFor(flight: Flight) {
        let flattenedScenarios: Scenario[] = [];
        flight.flightPlan.scenariosByContexts.forEach((scenarios) => flattenedScenarios = [...scenarios]);

        const flightPlanSerialized: any = {
            scenarios: flattenedScenarios.map((scenario: Scenario) => {
                return {
                    given: scenario.given?.name ?? 'No Context',
                    scenario: scenario.name
                };
            })
        };

        const serialized = this._serializer.toJSON(flightPlanSerialized);
        const outputFile = path.join(flight.flightPlan.outputPath, 'flightplan.json');

        fs.writeFileSync(outputFile, serialized);
    }

    private ensureCurrentScenarioPath(flight: Flight, microservice: Microservice) {
        const microservicePath = this.ensureMicroservicePath(flight, microservice);
        const currentScenarioPath = path.join(microservicePath, this._currentScenario?.name ?? 'NoScenario');
        if (!fs.existsSync(currentScenarioPath)) {
            fs.mkdirSync(currentScenarioPath);
        }
        return currentScenarioPath;
    }

    private ensureMicroservicePath(flight: Flight, microservice: Microservice): string {
        const microservicePath = path.join(flight.flightPlan.outputPath, microservice.name);
        if (!fs.existsSync(microservicePath)) {
            fs.mkdirSync(microservicePath);
        }
        return microservicePath;
    }
}
