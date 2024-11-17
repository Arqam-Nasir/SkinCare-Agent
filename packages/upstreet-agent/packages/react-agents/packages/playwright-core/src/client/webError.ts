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

import type * as api from '../../types/types';
import type { Page } from './page';

export class WebError implements api.WebError {
  private _page: Page | null;
  private _error: Error;

  constructor(page: Page | null, error: Error) {
    this._page = page;
    this._error = error;
  }

  page() {
    return this._page;
  }

  error() {
    return this._error;
  }
}
