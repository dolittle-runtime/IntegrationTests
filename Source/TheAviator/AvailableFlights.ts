// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import fs from 'fs';
import path from 'path';
import moment from 'moment';

import { Aviator } from './Aviator';

import { committing_a_single_event } from './tests/private_events/comitting_a_single_event';
import { two_events_with_pause_inbetween_committed } from './tests/private_events/two_events_with_pause_inbetween_committed';
import { twenty_events_committed } from './tests/private_events/twenty_events_committed';
import { twenty_events_committed_one_after_another } from './tests/private_events/twenty_events_committed_one_after_another';
import { single_aggregate_event_committed } from './tests/private_aggregate_events/single_aggregate_event_committed';
import { twenty_aggregate_events_committed } from './tests/private_aggregate_events/twenty_aggregate_events_committed';
import { twenty_aggregate_events_committed_one_after_another } from './tests/private_aggregate_events/twenty_aggregate_events_committed_one_after_another';
import { committing_a_single_public } from './tests/public_events/committing_a_single_public';
import { committing_public_events_with_unstable_consumer } from './tests/public_events/committing_public_events_with_unstable_consumer';
import { MainProcedure } from './procedures/MainProcedure';

const isDirectory = (source: string) => fs.lstatSync(source).isDirectory();
const getDirectories = (source: string) => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
const getOutputsDirectory = () => {
    return path.join(process.cwd(), 'resultOutput');
};

export class AvailableFlights {

    static async main() {
        try {
            console.log('Running pre-flight checklist');
            console.log('\n');

            const aviator = Aviator.getFor('dotnet');
            const flight = await aviator.performPreflightChecklist(
                committing_a_single_event,
                single_aggregate_event_committed,
                two_events_with_pause_inbetween_committed,
                twenty_events_committed,
                twenty_events_committed_one_after_another,
                twenty_aggregate_events_committed,
                twenty_aggregate_events_committed_one_after_another,
                committing_a_single_public,
                committing_public_events_with_unstable_consumer
            );

            console.log('\n');
            console.log('Checklist has been performed');
        } catch (ex) {
            console.log(ex);
        }
    }

    static async simulate() {
        try {
            const aviator = Aviator.getFor('dotnet');
            aviator.startSimulation({
                duration: moment.duration(1, 'hours'),
                coolOffPeriod: moment.duration(15, 'seconds'),
                warmUpPeriod: moment.duration(5, 'seconds'),
                maximumSimultaneousActors: 5,
                minimumIntervalForBehaviors: 1000,
                maximumIntervalForBehaviors: 10000
            }, new MainProcedure());
        } catch (ex) {

        }
    }

    static getLatestFlightResults(): any {
        const outputDirectory = getOutputsDirectory();
        const directories = getDirectories(outputDirectory).map(_ => _.substr(outputDirectory.length + 1));
        if (directories.length === 0) {
            return {};
        }
        const sortedDirectories = directories.sort().reverse();
        const resultsFile = path.join(outputDirectory, sortedDirectories[0], 'results.json');
        const content = fs.readFileSync(resultsFile).toString();
        return JSON.parse(content);
    }
}
