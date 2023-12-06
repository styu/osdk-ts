/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type {
  ObjectTypeKeysFrom,
  ObjectTypePropertyDefinitionFrom,
  ObjectTypePropertyKeysFrom,
  OntologyDefinition,
} from "@osdk/api";
import type { OsdkObjectPropertyType } from "../../Definitions.js";
import type { AggregationResultsWithoutGroups } from "./AggregationResultsWithoutGroups.js";
import type { AggregationClause } from "./AggregationsClause.js";
import type { GroupByClause } from "./GroupByClause.js";

export type AggregationResultsWithGroups<
  O extends OntologyDefinition<any>,
  K extends ObjectTypeKeysFrom<O>,
  A extends AggregationClause<O, K>,
  G extends GroupByClause<O, K> | undefined,
> = {
  group: {
    [P in keyof G & ObjectTypePropertyKeysFrom<O, K>]: OsdkObjectPropertyType<
      ObjectTypePropertyDefinitionFrom<O, K, P>
    >;
  };
  values: AggregationResultsWithoutGroups<O, K, A>;
}[];
