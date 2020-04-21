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
    FlightControl,
    Flight,
    FlightPlanner,
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

    async performFlightWith(...scenarios: Constructor<Scenario>[]): Promise<Flight> {
        console.log('\u2708 \u2708 Welcome to The Aviator - please enjoy the flight \u2708 \u2708');
        console.log('\u2705');
        console.log('\u274C');
        const flightPaths = new FlightPaths();
        const flightPlanner = new FlightPlanner(flightPaths, this.microserviceFactory);
        const flightPlan = flightPlanner.planFor(this.platform, ...scenarios);
        const flight = new Flight(this.platform, flightPlan);
        flight.setRecorder(new FlightRecorder(flight, this.serializer));
        const flightControl = new FlightControl(flight, this.microserviceFactory);
        await flightControl.takeOff();
        console.log('landed');
        return flight;
    }
}
