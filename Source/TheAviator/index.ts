// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import fs from 'fs';
import path from 'path';

import express from 'express';
import Banner from './Banner';

import teamsIntegration from './integration/teams';
import { AvailableFlights } from './AvailableFlights';

const port = 3000;
const app = express();

const isDirectory = (source: string) => fs.lstatSync(source).isDirectory();
const getDirectories = (source: string) => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
const getOutputsDirectory = () => {
    return path.join(process.cwd(), 'resultOutput');
};



// https://unicode-table.com/en/

//Banner.present();

app.get('/api/flight/start', async (request, response) => {
    response.send('Taking off');
    AvailableFlights.main();
});

app.get('/api/flights', (request, response) => {
    const outputDirectory = getOutputsDirectory();
    if (!fs.existsSync(outputDirectory)) {
        response.json([]);
    } else {
        const directories = getDirectories(outputDirectory).map(_ => _.substr(outputDirectory.length + 1));
        response.json(directories.sort().reverse());
    }
});

app.get('/api/flights/:flight', (request, response) => {
    const checklistFile = path.join(getOutputsDirectory(), request.params.flight, 'preflight-checklist.json');
    if (!fs.existsSync(checklistFile)) {
        response.json({});
    } else {
        const checklist = fs.readFileSync(checklistFile).toString();
        response.json(JSON.parse(checklist));
    }
});

app.listen(port, () => {
    console.log(`Running on port '::${port}' - awaiting your command.\n`);
    //teamsIntegration();
    console.log('ctrl + c to exit.\n');
    console.log(Banner.separator);
    console.log('\n');
});

(async () => {
    //await AvailableFlights.main();
    await AvailableFlights.simulate();
})();
