// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import {
    ChannelAccount,
    BotFrameworkAdapter,
    TurnContext,
    MessageFactory,
    TeamsInfo,
    TeamsActivityHandler,
    CardFactory,
    CardAction,
    ActionTypes,
    TeamsPagedMembersResult
} from 'botbuilder';

import { AvailableFlights } from '../../AvailableFlights';
import { Body } from 'node-fetch';

const TextEncoder = require('util').TextEncoder;

export class TeamsConversationBot extends TeamsActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context: TurnContext, next: () => Promise<void>) => {
            TurnContext.removeRecipientMention(context.activity);
            const text = context.activity.text.trim().toLocaleLowerCase();
            if (text.includes('run tests')) {
                await this.runTests(context);
            } else if (text.includes('show last test results')) {
                await this.showLastTestResults(context);
            } else if (text.includes('mention')) {
                await this.mentionActivityAsync(context);
            } else if (text.includes('update')) {
                await this.cardActivityAsync(context, true);
            } else if (text.includes('delete')) {
                await this.deleteCardActivityAsync(context);
            } else if (text.includes('message')) {
                await this.messageAllMembersAsync(context);
            } else if (text.includes('who')) {
                await this.getSingleMember(context);
            } else {
                await this.cardActivityAsync(context, false);
            }

            await next();
        });
    }

    async onMembersAddedActivity(membersAdded: ChannelAccount[], context: TurnContext): Promise<void> {
        for (const member of membersAdded) {
            if (member.id !== context.activity.recipient.id) {
                await context.sendActivity(`Welcome to the team ${member.name}`);
            }
        }
        super.onMembersAddedActivity(membersAdded, context);
    }

    async cardActivityAsync(context: TurnContext, isUpdate: boolean) {
        const cardActions = [
            {
                type: ActionTypes.MessageBack,
                title: 'Run integration tests',
                value: null,
                text: 'Run Tests'
            },
            {
                type: ActionTypes.MessageBack,
                title: 'Show last test results',
                value: null,
                text: 'Show last test results'
            }
        ];

        if (isUpdate) {
            await this.sendUpdateCard(context, cardActions);
        }
        else {
            await this.sendWelcomeCard(context, cardActions);
        }
    }

    async sendUpdateCard(context: TurnContext, cardActions: CardAction[]) {
        const data = context.activity.value;
        data.count += 1;
        cardActions.push({
            type: ActionTypes.MessageBack,
            title: 'Update Card',
            value: data,
            text: 'UpdateCardAction'
        });

        const card = CardFactory.heroCard(
            'Updated card',
            `Update count: ${data.count}`,
            undefined,
            cardActions
        );
        (card as any).id = context.activity.replyToId;
        const message = MessageFactory.attachment(card);
        message.id = context.activity.replyToId;
        await context.updateActivity(message);
    }

    async sendWelcomeCard(context: TurnContext, cardActions: CardAction[]) {
        const initialValue = {
            count: 0
        };
        cardActions.push({
            type: ActionTypes.MessageBack,
            title: 'Update Card',
            value: initialValue,
            text: 'UpdateCardAction'
        });

        const member = await TeamsInfo.getMember(context, context.activity.from.id);

        const card = CardFactory.heroCard(
            `Welcome to Dolittle, ${member.name}, how may I be of assistance?`,
            '',
            undefined,
            cardActions
        );
        await context.sendActivity(MessageFactory.attachment(card));
    }

    async getSingleMember(context: TurnContext) {
        let member;
        try {
            member = await TeamsInfo.getMember(context, context.activity.from.id);
        }
        catch (e) {
            if (e.code === 'MemberNotFoundInConversation') {
                context.sendActivity(MessageFactory.text('Member not found.'));
                return;
            }
            else {
                console.log(e);
                throw e;
            }
        }
        const message = MessageFactory.text(`You are: ${member.name}`);
        await context.sendActivity(message);
    }

    async runTests(context: TurnContext) {
        const mention = {
            mentioned: context.activity.from,
            text: `<at>${new TextEncoder().encode(context.activity.from.name)}</at>`,
            type: 'mention'
        };

        const replyActivity = MessageFactory.text(`Roger ${mention.text} - we're taking off with the flight.`);
        replyActivity.entities = [mention];
        await context.sendActivity(replyActivity);
        AvailableFlights.main();
    }

    async showLastTestResults(context: TurnContext) {
        // https://adaptivecards.io

        const results = AvailableFlights.getLatestFlightResults();

        const content = {
            version: '1.0',
            type: 'AdaptiveCard',
            speak: 'These are the latest results we got...',
            body: [] as any[]
        };

        for (const context of Object.keys(results)) {
            content.body.push({
                type: 'TextBlock',
                text: context,
                size: 'large',
                weight: 'bolder',
                spacing: 'medium',
                separator: true
            });

            for (const scenario of results[context]) {
                content.body.push({
                    type: 'TextBlock',
                    weight: 'bolder',
                    text: scenario.name,
                    spacing: 'medium'
                });

                for (const then of Object.keys(scenario.thens)) {
                    content.body.push({
                        type: 'TextBlock',
                        text: then,
                        isSubtle: true,
                        color: scenario.thens[then].length === 0 ? 'good' : 'attention'
                    });
                }
            }
        }

        const card = CardFactory.adaptiveCard(content);

        const activity = MessageFactory.attachment(card);
        await context.sendActivity(activity);
    }

    async mentionActivityAsync(context: TurnContext) {
        const mention = {
            mentioned: context.activity.from,
            text: `<at>${new TextEncoder().encode(context.activity.from.name)}</at>`,
            type: 'mention'
        };

        const replyActivity = MessageFactory.text(`Hi ${mention.text}`);
        replyActivity.entities = [mention];
        await context.sendActivity(replyActivity);
    }

    async deleteCardActivityAsync(context: TurnContext) {
        await context.deleteActivity(context.activity.replyToId || '');
    }

    async messageAllMembersAsync(context: TurnContext) {
        const members = await this.getPagedMembers(context);

        members.forEach(async (teamMember) => {
            const message = MessageFactory.text(`Hello ${teamMember.givenName} ${teamMember.surname}. I'm a Teams conversation bot.`);

            const ref = TurnContext.getConversationReference(context.activity);
            ref.user = teamMember;
            const adapter = context.adapter as BotFrameworkAdapter;
            await adapter.createConversation(ref,
                async (t1) => {
                    const ref2 = TurnContext.getConversationReference(t1.activity);
                    await t1.adapter.continueConversation(ref2, async (t2) => {
                        await t2.sendActivity(message);
                    });
                });
        });

        await context.sendActivity(MessageFactory.text('All messages have been sent.'));
    }

    async getPagedMembers(context: TurnContext) {
        let continuationToken;
        const members = [];
        do {
            const pagedMembers: TeamsPagedMembersResult = await TeamsInfo.getPagedMembers(context, 100, continuationToken);
            continuationToken = pagedMembers.continuationToken;
            members.push(...pagedMembers.members);
        } while (continuationToken !== undefined);
        return members;
    }
}

