// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import * as util from 'util';
const asyncTimeout = util.promisify(setTimeout);

export default asyncTimeout;
