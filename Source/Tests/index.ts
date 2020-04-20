import * as util from 'util';
const asyncTimeout = util.promisify(setTimeout);

import { Scenario } from './Scenario';
import { IGiven } from './IGiven';
import { Aviator } from './Aviator';
import { ScenarioContext } from './ScenarioContext';
import { Guid } from '@dolittle/rudiments';

export class a_single_microservice implements IGiven {
    async describe(context: ScenarioContext) {
        await context.withMicroservice('main', [Guid.parse('f79fcfc9-c855-4910-b445-1f167e814bfd')]);
    }
}

export class single_event_committed extends Scenario {
    given = a_single_microservice;

    readonly first_event_committed: any = { 'uniqueIdentifier': Guid.create().toString() };
    readonly second_event_committed: any = { 'uniqueIdentifier': Guid.create().toString() };

    async when_committing_a_single_event() {
        await this.context?.microservices.get('main')?.actions.commitEvent(Guid.parse('0e984977-1686-4036-98ef-14dc9f55f705'), this.first_event_committed);
        return [
            //this.stop_the_runtime,
            //this.send_another_Event
            //this.start_the_runtime,
            //this.wait_for_two_seconds
        ];
    }

    stop_the_runtime = async () => await this.context?.microservices.get('main')?.runtime.stop();
    send_another_Event = async () => await this.context?.microservices.get('main')?.actions.commitEvent(Guid.parse('0e984977-1686-4036-98ef-14dc9f55f705'), this.second_event_committed);
    start_the_runtime = async () => await this.context?.microservices.get('main')?.runtime.start();
    wait_for_two_seconds = async () => await asyncTimeout(2000);

    then_first_event_should_be_in_event_log = () => this.context?.microservices.get('main')?.event_log?.should_contain(this.first_event_committed);
    then_second_event_should_be_in_event_log = () => this.context?.microservices.get('main')?.event_log?.should_contain(this.second_event_committed);
}


(async () => {
    const aviator = Aviator.getFor('dotnet');
    const flight = aviator.performFlightWith(
        single_event_committed
    );
})();