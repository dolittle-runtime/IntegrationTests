// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ScenarioContext, ScenarioEnvironment, ScenarioEnvironmentBuilder, ISpecificationBuilder, ScenarioEnvironmentDefinition } from '../../gherkin';
import { FlightSimulationOptions } from './FlightSimulationOptions';
import { IFlightSimulationProcedure } from './IFlightSimulationProcedure';
import { FlightSimulationPlan } from './FlightSimulationPlan';
import { IFlightSimulationPlanner } from './IFlightSimulationPlanner';
import { TotalPercentageDoesNotAddUp } from './TotalPercentageDoesNotAddUp';
import { ScenarioInProcedure } from './ScenarioInProcedure';
import { DistributionDoesNotAllowScenariosWithoutPercentageToBePerformed } from './DistributionDoesNotAllowScenariosWithoutPercentageToBePerformed';
import { ScenarioForSimulation } from './ScenarioForSimulation';

export class FlightSimulationPlanner implements IFlightSimulationPlanner {
    constructor(private _scenarioEnvironmentBuilder: ScenarioEnvironmentBuilder, private _specificationBuilder: ISpecificationBuilder) {
    }

    async createPlanFor<T extends ScenarioContext>(platform: string, options: FlightSimulationOptions, procedure: IFlightSimulationProcedure<T>): Promise<FlightSimulationPlan> {
        let totalPercentage = 0;
        const scenariosWithPercentage: ScenarioInProcedure<T>[] = [];
        const scenariosWithoutPercentage: ScenarioInProcedure<T>[] = [];

        for (const scenario of procedure.scenarios) {
            totalPercentage += scenario.percentage;
            if (scenario.percentage === 0) {
                scenariosWithoutPercentage.push(scenario);
            } else {
                scenariosWithPercentage.push(scenario);
            }
        }

        this.throwIfTotalPercentageDoesNotAddUp<T>(totalPercentage, procedure);
        this.throwIfScenariosWithoutPercentageWillNotBePerformed<T>(totalPercentage, scenariosWithoutPercentage, procedure);

        if (scenariosWithoutPercentage.length === 0) {
            if (totalPercentage < 100) {
                const scale = 100 / totalPercentage;
                for (const scenario of procedure.scenarios) {
                    scenario.percentage = Math.round(scenario.percentage * scale);
                }
            }
        } else {
            const percentageLeft = 100 - totalPercentage;
            const distributedPercentage = percentageLeft / scenariosWithoutPercentage.length;
            for (const scenario of scenariosWithoutPercentage) {
                scenario.percentage = Math.round(distributedPercentage);
            }
        }

        const scenarios: ScenarioInProcedure<T>[] = [];

        for (const scenario of procedure.scenarios) {
            for (let i = 0; i < scenario.percentage; i++) {
                scenarios.push(scenario);
            }
        }

        while (scenarios.length < 100) {
            scenarios.push(scenarios[scenarios.length - 1]);
        }

        const scenarioContext = new procedure.context();
        const environmentDefinition = new ScenarioEnvironmentDefinition();
        scenarioContext.describe(environmentDefinition);

        const environment = await this._scenarioEnvironmentBuilder.buildFrom(platform, environmentDefinition);

        const scenariosForSimulation = scenarios.map(_ => {
            const scenarioFor = new _.scenarioType();
            const specification = this._specificationBuilder.buildFrom(scenarioFor);
            return new ScenarioForSimulation(_.scenarioType, environment, specification);
        });

        const plan = new FlightSimulationPlan(options, environment, scenariosForSimulation);
        return plan;
    }

    private throwIfTotalPercentageDoesNotAddUp<T extends ScenarioContext>(totalPercentage: number, procedure: IFlightSimulationProcedure<T>) {
        if (totalPercentage > 100) {
            throw new TotalPercentageDoesNotAddUp(procedure);
        }
    }

    private throwIfScenariosWithoutPercentageWillNotBePerformed<T extends ScenarioContext>(totalPercentage: number, scenariosWithoutPercentage: ScenarioInProcedure<T>[], procedure: IFlightSimulationProcedure<T>) {
        if (totalPercentage === 100 && scenariosWithoutPercentage.length > 0) {
            throw new DistributionDoesNotAllowScenariosWithoutPercentageToBePerformed(procedure);
        }
    }
}
