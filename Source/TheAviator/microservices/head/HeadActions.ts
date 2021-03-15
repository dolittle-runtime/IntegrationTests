

import fetch from 'node-fetch';

import { Microservice } from '../Microservice';
import { EventObject } from '../../tests/shared/EventObject';
import { Guid } from "@dolittle/rudiments";

export type EventHorizonSubscription = {
    consumerTenant: string,
    producerMicroservice: string,
    producerTenant: string,
    producerStream: string,
    producerPartition: string,
    consumerScope: string
};

export interface IHeadActions {
    checkStatus(): Promise<string>;
    startClient(): Promise<void>;
    stopClient(): Promise<void>;
    subscribeToEventHorizon(subscription: EventHorizonSubscription): Promise<void>;
    commitEvents(tenantId: Guid, eventSource: Guid, ...events: EventObject[]): Promise<void>;
    commitPublicEvents(tenantId: Guid, eventSource: Guid, ...events: EventObject[]): Promise<void>;
    commitAggregateEvents(tenantId: Guid, eventSource: Guid, version: number, ...events: EventObject[]): Promise<void>;
    getBaseUrl(): string;
}

export class HeadActions implements IHeadActions {
    readonly _runtimeHost: string;
    readonly _runtimePort: number;
    readonly _microserviceId: string;

    constructor(private readonly _microservice: Microservice) {
        this._runtimeHost = _microservice.configuration.runtime.host;
        this._runtimePort = _microservice.configuration.runtime.privatePort;
        this._microserviceId = _microservice.configuration.identifier;
    }

    async checkStatus(): Promise<string> {
        try {
            const url = `${this.getBaseUrl()}/api/Events`;
            const response = await fetch(url, { timeout: 1000 });
            const result = await response.text();
            return result;
        } catch (ex) {
            return '';
        }
    }

    async startClient(): Promise<void> {
        try {
            await this.postClientRequest(`${this.getBaseUrl()}/api/Clients/Start/${this.getClientIdUrlSegment()}`);
        } catch (ex) {
        }
    }
    
    async stopClient(): Promise<void> {
        try {
            await this.postClientRequest(`${this.getBaseUrl()}/api/Clients/Stop/${this.getClientIdUrlSegment()}`);
        } catch (ex) {
        }
    }
    async subscribeToEventHorizon(subscription: EventHorizonSubscription): Promise<void> {
        try {
            await this.postClientRequest(
                `${this.getBaseUrl()}/api/Clients/Subscribe/${this.getClientIdUrlSegment()}`,
                subscription);
        } catch (ex) {
        }
    }

    async commitEvents(tenantId: Guid, eventSource: Guid, ...events: EventObject[]): Promise<void> {
        try {
            await this.postCommitRequest(
                this.getUrlForCommittingEvents(tenantId, eventSource, false),
                events);
        } catch (ex) {
        }
    }

    async commitPublicEvents(tenantId: Guid, eventSource: Guid, ...events: EventObject[]): Promise<void> {
        try {
            await this.postCommitRequest(
                this.getUrlForCommittingEvents(tenantId, eventSource, true),
                events);
        } catch (ex) {
        }
    }

    async commitAggregateEvents(tenantId: Guid, eventSource: Guid, version: number, ...events: EventObject[]): Promise<void> {
        try {
            await this.postCommitRequest(
                this.getUrlForCommittingAggregateEvents(tenantId, eventSource, version),
                events);
        } catch (ex) { }
    }


    getBaseUrl() {
        return `http://localhost:${this._microservice.head.boundPorts.get(5000)}`;
    }

    private getClientIdUrlSegment() {
        return `${this._runtimeHost}/${this._runtimePort}/${this._microserviceId}`;
    }

    private getClientIdUrlSegmentForCommittingEvent(tenantId: Guid, eventSource: Guid) {
        return `${this.getClientIdUrlSegment()}/${tenantId.toString()}/${eventSource.toString()}`;
    }

    private getUrlForCommittingEvents(tenantId: Guid, eventSource: Guid, publicEvent: boolean): string {
        return `${this.getBaseUrl()}/api/Events/${publicEvent ? 'Public/' : ''}${this.getClientIdUrlSegmentForCommittingEvent(tenantId, eventSource)}`;
    }

    private getUrlForCommittingAggregateEvents(tenantId: Guid, eventSource: Guid, version: number): string {
        return `${this.getBaseUrl()}/api/Events/Aggregate/${this.getClientIdUrlSegmentForCommittingEvent(tenantId, eventSource)}/${version}`;
    }

    private postClientRequest(url: string, subscription?: EventHorizonSubscription) {
        return fetch(url, {
            method: 'post',
            body: JSON.stringify(subscription ?? {}),
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
        });
    }
    private postCommitRequest(url: string, content: any) {
        return fetch(url, {
            method: 'post',
            body: JSON.stringify(content),
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
        });
    }
    
}