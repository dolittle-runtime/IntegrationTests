// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { autoinject } from 'aurelia-dependency-injection';

import { HttpClient } from 'aurelia-fetch-client';

@autoinject
export class Index {
    flights: any[] = [];
    contexts: any[] = [];
    scenarios: any[] = [];

    currentFlight: any | undefined;
    currentFlightPlan: any | undefined;
    currentContext: any | undefined;

    constructor(private _httpClient: HttpClient) {
    }

    async attached() {
        await this.populateFlights();
    }

    async refresh() {
        await this.populateFlights();
    }

    private async populateFlights() {
        const result = await this._httpClient.get('/api/flights');
        const json = await result.json() as string[];
        this.flights = json.map(_ => {
            return { name: _ };
        });
    }

    private async getFlightPlan(flight: string) {
        const result = await this._httpClient.get(`/api/flights/${flight}`);
        const json = await result.json();
        this.currentFlightPlan = json;

        this.contexts = Object.keys(json).map(_ => {
            return { name: _ };
        });
    }

    clicked() {
        fetch('/api/flight/start');
    }

    async selectedFlightChanged(flight: any) {
        this.currentFlight = flight;
        await this.getFlightPlan(flight.name);
    }

    async selectedContextChanged(context: any) {
        this.currentContext = context;
        this.scenarios = this.currentFlightPlan[context.name];
    }
}
