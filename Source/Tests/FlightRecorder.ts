// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as fs from 'fs';
import * as path from 'path';

import { Flight } from './Flight';
import { IFlightRecorder } from './IFlightRecorder';
import { Scenario } from './Scenario';
import { ISerializer } from './ISerializer';
import { Microservice } from './Microservice';
import { IContainer } from './IContainer';

export class FlightRecorder implements IFlightRecorder {
    private _currentScenario: Scenario | undefined;
    private _colorRemoverRegEx: RegExp;


    constructor(private _serializer: ISerializer) {
        this._colorRemoverRegEx = /#[0-9a-f]{6}|#[0-9a-f]{3}/gi;
        this._colorRemoverRegEx.compile();
    }

    recordFor(flight: Flight): void {
        this.writeFlightPlanFor(flight);
        this.writeMicroservicesConfigurations(flight);
        this.hookUpLogOutputFor(flight);
    }

    setCurrentScenario(scenario: Scenario): void {
        this._currentScenario = scenario;
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
                const microservicePath = this.ensureMicroservicePath(flight, microservice);

                microservice.head.outputStream.on('data', this.getOutputStreamWriterFor(microservice, microservice.head, microservicePath));
                microservice.runtime.outputStream.on('data', this.getOutputStreamWriterFor(microservice, microservice.runtime, microservicePath));
                microservice.eventStoreStorage.outputStream.on('data', this.getOutputStreamWriterFor(microservice, microservice.eventStoreStorage, microservicePath));
            });
        }
    }

    private getOutputStreamWriterFor(microservice: Microservice, container: IContainer, microservicePath: string) {
        return (data: Buffer) => {
            const filtered = data.filter(_ => (_ === 0xa || _ === 0xd) || _ >= 0x20 && (_ < 0x80 || _ >= 0xa0));

            const currentScenarioPath = path.join(microservicePath, this._currentScenario?.name ?? 'NoScenario');
            if (!fs.existsSync(currentScenarioPath)) {
                fs.mkdirSync(currentScenarioPath);
            }
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

    private ensureMicroservicePath(flight: Flight, microservice: Microservice): string {
        const microservicePath = path.join(flight.flightPlan.outputPath, microservice.name);
        if (!fs.existsSync(microservicePath)) {
            fs.mkdirSync(microservicePath);
        }
        return microservicePath;
    }
}
