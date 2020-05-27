// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/rudiments';

import { ScenarioFor, ISpecificationBuilder, ScenarioContext, ScenarioEnvironment } from '../gherkin';

import { Scenario, ScenarioEnvironmentDefinition } from '../gherkin';

import { IPreflightPlanner } from './IPreflightPlanner';
import { PreflightChecklist } from './PreflightChecklist';
import { IScenarioEnvironmentBuilder } from '../gherkin';

export class PreflightPlanner implements IPreflightPlanner {

    constructor(private _scenarioEnvironmentBuilder: IScenarioEnvironmentBuilder, private _specificationBuilder: ISpecificationBuilder) {
    }

    async createChecklistFor(platform: string, ...scenarios: Constructor<ScenarioFor<ScenarioContext>>[]): Promise<PreflightChecklist> {
        const scenarioEnvironmentsByContextType: Map<Constructor<ScenarioContext>, ScenarioEnvironment> = new Map();
        const scenarioContextsByContextType: Map<Constructor<ScenarioContext>, ScenarioContext> = new Map();
        const scenariosByEnvironments: Map<ScenarioEnvironment, Scenario[]> = new Map();

        for (const scenarioForConstructor of scenarios) {
            const instance = new scenarioForConstructor() as ScenarioFor<ScenarioContext>;
            const scenarioContextType = instance.for;

            let scenarioEnvironment: ScenarioEnvironment | undefined;

            if (scenarioEnvironmentsByContextType.has(scenarioContextType)) {
                scenarioEnvironment = scenarioEnvironmentsByContextType.get(scenarioContextType);
            } else {
                const scenarioContext = new scenarioContextType();

                const scenarioEnvironmentDefinition = new ScenarioEnvironmentDefinition();
                scenarioContext.describe(scenarioEnvironmentDefinition);

                scenarioEnvironment = await this._scenarioEnvironmentBuilder.buildFrom(platform, scenarioEnvironmentDefinition);
                scenarioEnvironmentsByContextType.set(scenarioContextType, scenarioEnvironment);
                scenariosByEnvironments.set(scenarioEnvironment, []);
                scenarioContextsByContextType.set(scenarioContextType, scenarioContext);
            }

            instance.context = scenarioContextsByContextType.get(scenarioContextType);

            if (scenarioEnvironment) {
                const specification = this._specificationBuilder.buildFrom(instance);
                const scenario = new Scenario(instance, scenarioEnvironment, specification);
                scenariosByEnvironments.get(scenarioEnvironment)?.push(scenario);
            }
        }

        return new PreflightChecklist(scenariosByEnvironments);
    }
}
