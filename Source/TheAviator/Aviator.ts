// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from './Constructor';
import { ISerializer } from './ISerializer';
import { Serializer } from './Serializer';

import { IMicroserviceFactory, MicroserviceFactory } from './microservices';

import { IContainerEnvironment } from './containers';
import { ContainerEnvironment } from './containers/docker';

import {
    FlightRecorder,
    FlightInspection,
    Flight,
    PreflightPlanner,
    FlightPaths
} from './flights';

import { Scenario } from './gherkin/Scenario';
import { IConfigurationManager, ConfigurationManager } from './microservices/configuration';

export class Aviator {
    readonly platform: string;
    readonly serializer: ISerializer;
    readonly containerFactory: IContainerEnvironment;
    readonly microserviceFactory: IMicroserviceFactory;
    readonly configurationManager: IConfigurationManager;

    private constructor(platform: string) {
        this.platform = platform;
        this.serializer = new Serializer();
        this.containerFactory = new ContainerEnvironment();
        this.configurationManager = new ConfigurationManager();

        this.microserviceFactory = new MicroserviceFactory(this.containerFactory, this.configurationManager);
    }

    static getFor(platform: string) {
        return new Aviator(platform);
    }

    async performPreflightChecklist(...scenarios: Constructor<Scenario>[]): Promise<Flight> {
        const flightPaths = new FlightPaths();
        const flightPlanner = new PreflightPlanner(flightPaths, this.microserviceFactory);
        const checklist = flightPlanner.createChecklistFor(this.platform, ...scenarios);
        const flight = new Flight(this.platform, checklist);
        flight.setRecorder(new FlightRecorder(flight, this.serializer));
        const flightControl = new FlightInspection(flight, this.microserviceFactory);
        await flightControl.runPreflightCheck();
        return flight;
    }
}
