// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export default function humanReadable(input: string): string {
    return input.split('_').join(' ');
}
