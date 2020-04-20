// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Scenario } from '../Scenario';
import { a_single_microservice } from './a_single_microservice';
import { Microservice } from '../Microservice';


export class scenario_for_a_single_microservice extends Scenario {
    given = a_single_microservice;

    microservice: Microservice | undefined;

    async when() {
        this.microservice = this.context?.microservices.get('main');
        return super.when();
    }
}
