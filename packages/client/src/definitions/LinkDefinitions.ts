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
  ObjectOrInterfacePropertyKeysFrom,
  ObjectTypeKeysFrom,
  ObjectTypeLinkDefinitionFrom,
  ObjectTypeLinkKeysFrom,
  OntologyDefinition,
} from "@osdk/api";
import type { FetchPageOrThrowArgs } from "../object/fetchPageOrThrow.js";
import type {
  OsdkObjectFrom,
  OsdkObjectPrimaryKeyType,
} from "../OsdkObjectFrom.js";
import type { PageResult } from "../PageResult.js";
import type { NOOP } from "../util/NOOP.js";

/** The $link container to get from one object type to its linked objects */
export type OsdkObjectLinksObject<
  K extends ObjectTypeKeysFrom<O>,
  O extends OntologyDefinition<any>,
> = ObjectTypeLinkKeysFrom<O, K> extends never ? never : {
  [L in ObjectTypeLinkKeysFrom<O, K>]: OsdkObjectLinksEntry<K, O, L>;
};

export type OsdkObjectLinksEntry<
  K extends ObjectTypeKeysFrom<O>,
  O extends OntologyDefinition<any>,
  L extends ObjectTypeLinkKeysFrom<O, K>,
> = ObjectTypeLinkDefinitionFrom<O, K, L> extends { multiplicity: false } ? {
    /** Load the linked object */
    get: () => OsdkObjectFrom<
      ObjectTypeLinkDefinitionFrom<O, K, L>["targetType"],
      O
    >;
  }
  : {
    /** Loads the linked object for a given primary key */
    get: (
      primaryKey: OsdkObjectPrimaryKeyType<
        ObjectTypeLinkDefinitionFrom<O, K, L>["targetType"],
        O
      >,
    ) => OsdkObjectFrom<ObjectTypeLinkDefinitionFrom<O, K, L>["targetType"], O>;

    /** pages through the linked objects */
    fetchPageOrThrow: <
      A extends FetchPageOrThrowArgs<
        O,
        ObjectTypeLinkDefinitionFrom<O, K, L>["targetType"],
        ObjectOrInterfacePropertyKeysFrom<
          O,
          ObjectTypeLinkDefinitionFrom<O, K, L>["targetType"]
        >
      >,
    >(options?: A) => Promise<
      PageResult<
        NOOP<
          OsdkObjectFrom<
            ObjectTypeLinkDefinitionFrom<O, K, L>["targetType"],
            O,
            A["select"] extends readonly string[] ? A["select"][number]
              : ObjectOrInterfacePropertyKeysFrom<
                O,
                ObjectTypeLinkDefinitionFrom<O, K, L>["targetType"]
              >
          >
        >
      >
    >;
  };
