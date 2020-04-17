// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IFlightControl } from './IFlightControl';
import { IMicroserviceFactory } from './IMicroserviceFactory';
import { IContainerFactory } from './IContainerFactory';
import { IFlightRecorder } from './IFlightRecorder';
import { ContainerFactory } from './ContainerFactory';
import { MicroserviceFactory } from './MicroserviceFactory';
import { FlightRecorder } from './FlightRecorder';
import { FlightControl } from './FlightControl';
import { Scenario } from 'Scenario';
import { Flight } from 'Flight';
import { IFlightPlanner } from './IFlightPlanner';
import { FlightPlanner } from './FlightPlanner';
import { Constructor } from 'Constructor';

export class Aviator {
    readonly containerFactory: IContainerFactory;
    readonly microserviceFactory: IMicroserviceFactory;
    readonly flightRecorder: IFlightRecorder;
    readonly flightControl: IFlightControl;
    readonly flightPlanner: IFlightPlanner;

    private constructor(target: string) {
        this.containerFactory = new ContainerFactory();
        this.microserviceFactory = new MicroserviceFactory(this.containerFactory);
        this.flightRecorder = new FlightRecorder();
        this.flightControl = new FlightControl(this.microserviceFactory, this.flightRecorder);
        this.flightPlanner = new FlightPlanner();
    }

    static getFor(target: string) {
        return new Aviator(target);
    }

    performFlightWith(...scenarios: Constructor<Scenario>[]): Flight {
        const plan = this.flightPlanner.planFor(...scenarios);
        const flight = new Flight(plan);
        return flight;
    }
}
