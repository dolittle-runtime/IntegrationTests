// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IFlightSimulationProcedure, ScenarioInProcedure, UnexpectedBehaviorInProcedure } from '../flights/simulation';
import { a_producer_and_a_consumer } from '../tests/given/a_producer_and_a_consumer';
import { ScenarioFor } from '../gherkin';
import { Guid } from '@dolittle/rudiments';

export class committing_single_event extends ScenarioFor<a_producer_and_a_consumer> {
    readonly event_source = Guid.parse('a3a31d32-3526-4742-8e10-ec121ffe2c15');
    readonly event_committed: any = { 'uniqueIdentifier': Guid.create().toString() };

    for = a_producer_and_a_consumer;

    when_event_is_committed = async () => await this.context?.producer?.commitEvent(this.event_source, this.event_committed);

    then_the_event_should_appear_in_the_event_log = () => this.context?.producer?.event_log?.should_contain(this.context?.tenant, this.event_committed);
}


export class MainProcedure implements IFlightSimulationProcedure<a_producer_and_a_consumer> {
    context = a_producer_and_a_consumer;
    scenarios = [
        { scenarioType: committing_single_event, percentage: 0 }
    ];
    unexpectedBehaviors = [];
}
