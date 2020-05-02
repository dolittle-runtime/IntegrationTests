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

import { IConfigurationManager, ConfigurationManager } from './microservices/configuration';

import {
    ScenarioContext,
    ScenarioFor,
    ISpecificationBuilder,
    SpecificationBuilder,
    IScenarioEnvironmentBuilder,
    ScenarioEnvironmentBuilder
} from './gherkin';

import { FlightSimulationOptions, IFlightSimulationProcedure, FlightSimulation, FlightSimulator } from './flights/simulation';

export class Aviator {
    readonly platform: string;
    readonly serializer: ISerializer;
    readonly containerFactory: IContainerEnvironment;
    readonly microserviceFactory: IMicroserviceFactory;
    readonly configurationManager: IConfigurationManager;
    readonly specificationBuilder: ISpecificationBuilder;
    readonly scenarioEnvironmentBuilder: IScenarioEnvironmentBuilder;

    private constructor(platform: string) {
        this.platform = platform;
        this.serializer = new Serializer();
        this.containerFactory = new ContainerEnvironment();
        this.configurationManager = new ConfigurationManager();
        this.specificationBuilder = new SpecificationBuilder();
        this.microserviceFactory = new MicroserviceFactory(this.containerFactory, this.configurationManager);
        this.scenarioEnvironmentBuilder = new ScenarioEnvironmentBuilder(this.microserviceFactory);
    }

    static getFor(platform: string) {
        return new Aviator(platform);
    }

    async performPreflightChecklist(...scenarios: Constructor<ScenarioFor<any>>[]): Promise<Flight> {
        const flightPaths = new FlightPaths();
        const flightPlanner = new PreflightPlanner(flightPaths, this.scenarioEnvironmentBuilder, this.specificationBuilder);
        const checklist = await flightPlanner.createChecklistFor(this.platform, ...scenarios);
        const flight = new Flight(this.platform, checklist);
        flight.setRecorder(new FlightRecorder(flight, this.serializer));
        const flightControl = new FlightInspection(flight, this.microserviceFactory);
        await flightControl.runPreflightCheck();
        return flight;
    }

    async startSimulation<T extends ScenarioContext>(options: FlightSimulationOptions, procedure: IFlightSimulationProcedure<T>): Promise<FlightSimulation> {
        const simulator = new FlightSimulator();
        const simulation = simulator.startFor(options, procedure);
        return simulation;
    }
}
