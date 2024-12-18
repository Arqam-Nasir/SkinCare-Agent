/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// The `process.hrtime()` returns a time from some arbitrary
// date in the past; on certain systems, this is the time from the system boot.
// The `monotonicTime()` converts this to milliseconds.
//
// For a Linux server with uptime of 36 days, the `monotonicTime()` value
// will be 36 * 86400 * 1000 = 3_110_400_000, which is larger than
// the maximum value that `setTimeout` accepts as an argument: 2_147_483_647.
//
// To make the `monotonicTime()` a reasonable value, we anchor
// it to the time of the first import of this utility.
export function hrtime(previousTimestamp?: [number, number]): [number, number] {
  const timeInMs = performance.now();

  if (previousTimestamp !== undefined) {
      const diffInMs = timeInMs - (previousTimestamp[0] * 1e3 + previousTimestamp[1] / 1e6);
      const seconds = Math.floor(diffInMs / 1000);
      const nanoseconds = Math.floor((diffInMs % 1000) * 1e6);
      return [seconds, nanoseconds];
  } else {
      const seconds = Math.floor(timeInMs / 1000);
      const nanoseconds = Math.floor((timeInMs % 1000) * 1e6);
      return [seconds, nanoseconds];
  }
}
const initialTime = hrtime();

export function monotonicTime(): number {
  const [seconds, nanoseconds] = hrtime(initialTime);
  return seconds * 1000 + (nanoseconds / 1000 | 0) / 1000;
}

export function setImmediate(callback: (...args: any[]) => void, ...args: any[]): void {
  setTimeout(callback, 0, ...args);
}