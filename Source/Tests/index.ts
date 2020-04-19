import * as util from 'util';
const asyncTimeout = util.promisify(setTimeout);

import { Scenario } from './Scenario';
import { IGiven } from './IGiven';
import { Aviator } from './Aviator';
import { ScenarioContext } from './ScenarioContext';
import { Guid } from '@dolittle/rudiments';
import { EventLogRuleSetContainerBuilder } from './rules/EventLogRuleSetContainerBuilder';

export class a_single_microservice implements IGiven {
    async describe(context: ScenarioContext) {
        await context.withMicroservice('main', [Guid.parse('f79fcfc9-c855-4910-b445-1f167e814bfd')]);
    }
}

export class single_event_committed extends Scenario {
    given = a_single_microservice;

    async when_committing_a_single_event() {
        return [
            //this.wait_for_2_seconds,
            this.stop_the_runtime,
            this.send_another_Event,
            this.start_the_runtime
        ];
    }

    wait_for_2_seconds = async () => await asyncTimeout(2000);
    stop_the_runtime = async () => await this.context?.microservices.get('main')?.runtime.stop();
    send_another_Event = async () => { };
    start_the_runtime = async () => { };

    then_it_should_be_inserted_in_the_event_log = () => {
        this.context?.microservices.get('main')?.event_log.should_contain();
    }
}


(async () => {
    /*const scenario = new single_event_committed();
    await scenario.when();
    await scenario.then();*/
    const aviator = Aviator.getFor('dotnet');
    const flight = aviator.performFlightWith(
        single_event_committed
    );
})();


/*
import * as util from 'util';
import { ContainerEnvironment } from './ContainerEnvironment';

import * as path from 'path';
import * as process from 'process';
import { LogMessageWaitStrategy } from './LogMessageWaitStrategy';
import { MicroserviceFactory } from './MicroserviceFactory';
import { Guid } from '@dolittle/rudiments';
import { MicroserviceActions } from './MicroserviceActions';


const asyncTimeout = util.promisify(setTimeout);


(async () => {

    const containerEnvironment = new ContainerEnvironment();
    const microserviceFactory = new MicroserviceFactory(containerEnvironment);
    const microservice = await microserviceFactory.create('main', path.join(process.cwd(), 'tt'), [
        Guid.parse('f79fcfc9-c855-4910-b445-1f167e814bfd')
    ], 'dotnet');

    microservice.head.outputStream.pipe(process.stdout);
    microservice.runtime.outputStream.pipe(process.stdout);
    microservice.eventStoreStorage.outputStream.pipe(process.stdout);

    microservice.start();

    await asyncTimeout(5000);

    const actions = new MicroserviceActions(microservice);
    //const result = await actions.checkStatus();
    const result = await actions.sendEvent(Guid.create(), { 'uniqueIdentifier': Guid.create().toString() });

    await asyncTimeout(400000);

    //microservice.kill();

    const container = containerFactory.create({
        image: 'dolittle/mongodb',
        exposedPorts: [27017],
        mounts: [{
            host: path.join(process.cwd(), 'data'),
            container: '/data/db'
        }]
    });
    await container.configure();
    await container.start();

    container.outputStream.pipe(process.stdout);
    //await container.start(new LogMessageWaitStrategy('Marking collection admin.system.keys'));

    console.log(container.boundPorts);

    await asyncTimeout(2000);
    //container.kill();
})();
*/
