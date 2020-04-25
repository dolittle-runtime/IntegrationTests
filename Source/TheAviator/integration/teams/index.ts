// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import path from 'path';
import restify from 'restify';
import { BotFrameworkAdapter } from 'botbuilder';

import { TeamsConversationBot } from './teamsConversationBot';

import dotenv from 'dotenv';


export default function () {
    const ENV_FILE = path.join(process.cwd(), '.env');
    dotenv.config({ path: ENV_FILE });

    const adapter = new BotFrameworkAdapter({
        appId: process.env.MicrosoftAppId,
        appPassword: process.env.MicrosoftAppPassword
    });

    adapter.onTurnError = async (context, error) => {
        console.error(`\n [onTurnError] unhandled error: ${error}`);

        await context.sendTraceActivity(
            'OnTurnError Trace',
            `${error}`,
            'https://www.botframework.com/schemas/error',
            'TurnError'
        );

        await context.sendActivity('The bot encountered an error or bug.');
        await context.sendActivity('To continue to run this bot, please fix the bot source code.');
    };

    const bot = new TeamsConversationBot();

    const server = restify.createServer();
    server.listen(process.env.port || process.env.PORT || 3978, function () {
        console.log(`\n${server.name} listening to ${server.url}`);
    });

    server.post('/api/messages', (req, res) => {
        adapter.processActivity(req, res, async (context) => {
            await bot.run(context);
        });
    });
}
