import * as util from 'util';
import { ContainerFactory } from './ContainerFactory';

import * as path from 'path';
import * as process from 'process';
import { LogMessageWaitStrategy } from './LogMessageWaitStrategy';


const asyncTimeout = util.promisify(setTimeout);


(async () => {
    const containerFactory = new ContainerFactory();
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

    container.kill();
})();


