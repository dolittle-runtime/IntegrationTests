import { Aviator } from './Aviator';

import { single_events_committed } from './tests/single_events_committed';

(async () => {
    const aviator = Aviator.getFor('dotnet');
    const flight = await aviator.performFlightWith(
        single_events_committed
    );
})();
