// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import fs from 'fs';
import path from 'path';

import { Aviator } from './Aviator';

import { single_event_committed } from './tests/single_event_committed';
import { two_events_with_pause_inbetween_committed } from './tests/two_events_with_pause_inbetween_committed';
import { twenty_events_committed } from './tests/twenty_events_committed';
import { single_aggregate_event_committed } from './tests/single_aggregate_event_committed';

const isDirectory = (source: string) => fs.lstatSync(source).isDirectory();
const getDirectories = (source: string) => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
const getOutputsDirectory = () => {
    return path.join(process.cwd(), 'resultOutput');
};

export class AvailableFlights {

    static async main() {
        try {
            console.log('Taking off');
            console.log('\n');

            const aviator = Aviator.getFor('dotnet');
            const flight = await aviator.performFlightWith(
                single_event_committed,
                single_aggregate_event_committed,
                two_events_with_pause_inbetween_committed,
                twenty_events_committed
            );

            console.log('\n');
            console.log('Arrived and landed at destination');
        } catch (ex) {
            console.log(ex);
        }
    }

    static getLatestFlightResults(): any {
        const outputDirectory = getOutputsDirectory();
        const directories = getDirectories(outputDirectory).map(_ => _.substr(outputDirectory.length + 1));
        if (directories.length === 0) {
            return {};
        }
        const sortedDirectories = directories.sort().reverse();
        const flightPlanFile = path.join(outputDirectory, sortedDirectories[0], 'results.json');
        const content = fs.readFileSync(flightPlanFile).toString();
        return JSON.parse(content);
    }
}
