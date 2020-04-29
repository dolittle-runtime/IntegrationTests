import { Duration } from 'moment';
export class FlightSimulationOptions {
    duration!: Duration;
    warmUpPeriod!: Duration;
    coolOffPeriod!: Duration;
    maximumSimultaneousUsers: number = 1;
}
