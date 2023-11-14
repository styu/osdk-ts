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

import { createFetch } from "../../../createFetch.mjs";
import { fetchWebsiteRepositoryRid } from "../../../third-party-application-service/fetchWebsiteRepositoryRid.mjs";
import type { ThirdPartyAppRid } from "../../../ThirdPartyAppRid.js";
import type { SiteVersion } from "./SiteVersion.mjs";

interface UpdateDeployedVersionRequest {
  siteVersion: {
    version: string;
  };
}

function getSitesAdminV2ServiceBaseUrl(baseUrl: string) {
  return `${baseUrl}/artifacts/api/sites/v2/admin`;
}

// This is from conjure but the others are not. Interestingly
export async function fetchDeployedVersion(
  baseUrl: string,
  thirdPartyAppRid: ThirdPartyAppRid,
) {
  const repositoryRid = await fetchWebsiteRepositoryRid(
    baseUrl,
    thirdPartyAppRid,
  );
  const url = `${
    getSitesAdminV2ServiceBaseUrl(baseUrl)
  }/repository/${repositoryRid}/deployed-version`;
  const fetch = createFetch(() => process.env.FOUNDRY_SDK_AUTH_TOKEN as string);

  const result = await fetch(url, {
    method: "GET",
  });

  if (result.status === 204) {
    return undefined;
  } else if (result.status >= 200 && result.status < 300) {
    return await result.json() as SiteVersion;
  } else {
    throw new Error(
      `Unexpected response code ${result.status} (${result.statusText})`,
    );
  }
}
