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

    async when_I_commit_a_single_event() {
    }

    async then_it_should_be_inserted_in_the_event_log() {
    }
}


(async() => {
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
