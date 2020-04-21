// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IMicroserviceFactory } from './microservices/IMicroserviceFactory';
import { MicroserviceFactory } from './microservices/MicroserviceFactory';
import { ContainerEnvironment } from './containers/docker/ContainerEnvironment';
import { IContainerEnvironment } from './containers/IContainerEnvironment';
import { FlightRecorder } from './flights/FlightRecorder';
import { FlightControl } from './flights/FlightControl';
import { Scenario } from './gherkin/Scenario';
import { Flight } from './flights/Flight';
import { FlightPlanner } from './flights/FlightPlanner';
import { Constructor } from './Constructor';
import { ISerializer } from './ISerializer';
import { Serializer } from './Serializer';
import { FlightPaths } from './flights/FlightPaths';

export class Aviator {
    readonly platform: string;
    readonly serializer: ISerializer;
    readonly containerFactory: IContainerEnvironment;
    readonly microserviceFactory: IMicroserviceFactory;

    private constructor(platform: string) {
        this.platform = platform;
        this.serializer = new Serializer();
        this.containerFactory = new ContainerEnvironment();
        this.microserviceFactory = new MicroserviceFactory(this.containerFactory, this.serializer);
    }

    static getFor(platform: string) {
        return new Aviator(platform);
    }

    async performFlightWith(...scenarios: Constructor<Scenario>[]): Promise<Flight> {
        const flightPaths = new FlightPaths();
        const flightPlanner = new FlightPlanner(flightPaths, this.microserviceFactory);
        const flightPlan = flightPlanner.planFor(this.platform, ...scenarios);
        const flight = new Flight(this.platform, flightPlan);
        flight.setRecorder(new FlightRecorder(flight, this.serializer));
        const flightControl = new FlightControl(flight, this.microserviceFactory);
        await flightControl.takeOff();
        return flight;
    }
}
