// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Specification } from './Specification';
import { SpecificationResult } from './SpecificationResult';
import { ISpecificationRunner } from './ISpecificationRunner';
import { ScenarioContext } from './ScenarioContext';
import { ScenarioFor } from './ScenarioFor';
import { ScenarioWithThenSubject } from 'rules';
import { ThenResult } from './ThenResult';
import { BrokenRule } from '@dolittle/rules';

export class SpecificationRunner implements ISpecificationRunner {
    async run(scenarioFor: ScenarioFor<ScenarioContext>, specification: Specification): Promise<SpecificationResult> {
        for (const given of specification.givens) {
            await given.invoke(scenarioFor);
        }

        await specification.when.invoke(scenarioFor);

        for (const and of specification.ands) {
            await and.invoke(scenarioFor);
        }

        for (const then of specification.thens) {
            await then.invoke(scenarioFor);
        }

        const thenResults: ThenResult[] = [];

        if (scenarioFor.context) {
            const brokenRulesByThens: { [key: string]: BrokenRule[] } = {};

            const microservices = Object.values(scenarioFor.context.microservices);
            for (const microservice of microservices) {
                const brokenRules = await microservice.evaluate();
                for (const brokenRule of brokenRules) {
                    const subject = brokenRule.subject as ScenarioWithThenSubject;
                    let brokenRulesForThen: BrokenRule[];
                    if (brokenRulesByThens.hasOwnProperty(subject.then)) {
                        brokenRulesForThen = brokenRulesByThens[subject.then];
                    } else {
                        brokenRulesForThen = [];
                        brokenRulesByThens[subject.then] = brokenRulesForThen;
                    }

                    brokenRulesForThen.push(brokenRule);
                }
            }

            for (const thenName of Object.keys(brokenRulesByThens)) {
                const then = specification.thens.find(_ => _.name === thenName);
                if (then) {
                    const result = new ThenResult(then, brokenRulesByThens[thenName]);
                    thenResults.push(result);
                }
            }
        }

        return new SpecificationResult(specification, thenResults);
    }
}
