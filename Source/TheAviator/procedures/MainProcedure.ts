// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IFlightSimulationProcedure, ScenarioInProcedure, UnexpectedBehaviorInProcedure } from '../flights/simulation';
import { a_producer_and_a_consumer } from '../tests/given/a_producer_and_a_consumer';
import { ScenarioFor } from '../gherkin';

export class committing_single_event extends ScenarioFor<a_producer_and_a_consumer> {
    for = a_producer_and_a_consumer;

    when_event_is_committed = () => { };

    then_event_should_be_in_event_log = () => { };
}


export class MainProcedure implements IFlightSimulationProcedure<a_producer_and_a_consumer> {
    context = a_producer_and_a_consumer;
    scenarios = [
        { scenarioType: committing_single_event, percentage: 0 }
    ];
    unexpectedBehaviors = [];
}
