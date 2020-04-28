// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import fs from 'fs';
import path from 'path';

import { Aviator } from './Aviator';

import { single_event_committed } from './tests/when_committing_private/single_event_committed';
import { two_events_with_pause_inbetween_committed } from './tests/when_committing_private/two_events_with_pause_inbetween_committed';
import { twenty_events_committed } from './tests/when_committing_private/twenty_events_committed';
import { single_aggregate_event_committed } from './tests/when_committing_private/single_aggregate_event_committed';
import { twenty_aggregate_events_committed } from './tests/when_committing_private/twenty_aggregate_events_committed';
import { single_public_event_committed } from './tests/when_committing_public/single_public_event_committed';

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
                single_event_committed,
                single_aggregate_event_committed,
                two_events_with_pause_inbetween_committed,
                twenty_events_committed,
                twenty_aggregate_events_committed,
                single_public_event_committed
            );

            console.log('\n');
            console.log('Checklist has been performed');
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
        const resultsFile = path.join(outputDirectory, sortedDirectories[0], 'results.json');
        const content = fs.readFileSync(resultsFile).toString();
        return JSON.parse(content);
    }
}
