// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IFlightControl } from './IFlightControl';
import { IMicroserviceFactory } from './IMicroserviceFactory';
import { IContainerEnvironment } from './IContainerEnvironment';
import { IFlightRecorder } from './IFlightRecorder';
import { ContainerEnvironment } from './ContainerEnvironment';
import { MicroserviceFactory } from './MicroserviceFactory';
import { FlightRecorder } from './FlightRecorder';
import { FlightControl } from './FlightControl';
import { Scenario } from './Scenario';
import { Flight } from './Flight';
import { IFlightPlanner } from './IFlightPlanner';
import { FlightPlanner } from './FlightPlanner';
import { Constructor } from './Constructor';
import { ISerializer } from './ISerializer';
import { Serializer } from './Serializer';

export class Aviator {
    readonly target: string;
    readonly serializer: ISerializer;
    readonly containerFactory: IContainerEnvironment;
    readonly microserviceFactory: IMicroserviceFactory;
    readonly flightRecorder: IFlightRecorder;
    readonly flightControl: IFlightControl;
    readonly flightPlanner: IFlightPlanner;

    private constructor(target: string) {
        this.target = target;
        this.serializer = new Serializer();
        this.containerFactory = new ContainerEnvironment();
        this.microserviceFactory = new MicroserviceFactory(this.containerFactory, this.serializer);
        this.flightRecorder = new FlightRecorder(this.serializer);
        this.flightControl = new FlightControl(this.flightRecorder);
        this.flightPlanner = new FlightPlanner(this.microserviceFactory);
    }

    static getFor(target: string) {
        return new Aviator(target);
    }

    async performFlightWith(...scenarios: Constructor<Scenario>[]): Promise<Flight> {
        const flightPlan = this.flightPlanner.planFor(this.target, ...scenarios);
        const flight = await this.flightControl.takeOffWith(flightPlan);
        return flight;
    }
}
