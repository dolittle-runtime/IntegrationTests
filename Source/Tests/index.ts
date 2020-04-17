

import { IMicroserviceFactory } from './IMicroserviceFactory';
import { Scenario } from './Scenario';
import { IGiven } from './IGiven';
import { Aviator } from 'Aviator';
import { ScenarioContext } from 'ScenarioContext';

export class a_single_microservice implements IGiven {
    context(microserviceFactory: IMicroserviceFactory): ScenarioContext {
        throw new Error('Method not implemented.');
    }
}

export class single_event_committed extends Scenario {
    given = a_single_microservice;

    when_I_commit_a_single_event() {
    }

    then_it_should_be_inserted_in_the_event_log() {
    }
}

const aviator = Aviator.getFor('dotnet');
const flight = aviator.performFlightWith(
    single_event_committed
);


/*
import * as util from 'util';
import { ContainerFactory } from './ContainerFactory';

import * as path from 'path';
import * as process from 'process';
import { LogMessageWaitStrategy } from './LogMessageWaitStrategy';
import { MicroserviceFactory } from './MicroserviceFactory';


const asyncTimeout = util.promisify(setTimeout);
*/

(async () => {

    /*
    const containerFactory = new ContainerFactory();
    const microserviceFactory = new MicroserviceFactory(containerFactory);
    const microservice = microserviceFactory.create('dotnet');

    microservice.head.outputStream.pipe(process.stdout);
    microservice.runtime.outputStream.pipe(process.stdout);
    microservice.eventStoreStorage.outputStream.pipe(process.stdout);

    microservice.start();

    await asyncTimeout(4000);

    microservice.kill();
    */

    /*
    const container = containerFactory.create({
        image: 'dolittle/mongodb',
        exposedPorts: [27017],
        mounts: [{
            host: path.join(process.cwd(),'data'),
            container: '/data/db'
        }]
    });
    await container.start(new LogMessageWaitStrategy('Marking collection admin.system.keys'));

    console.log(container.boundPorts);

    container.outputStream.pipe(process.stdout);

    container.kill();*/
})();


