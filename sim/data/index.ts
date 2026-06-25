/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Barrel re-export for /sim/data \u2014 historical / seed data only.
 * No React, no LLM. Anything in /sim or /apps reads seed data from here.
 */

export { HISTORICAL_PLATFORMS } from "./platforms";
export { DEMO_EFFECTS } from "./demoEffects";
export { TECHNOLOGY_TREE } from "./technologyTree";
export { INITIAL_NPCS } from "./initialNpcs";
export { INITIAL_GROUPS } from "./initialGroups";
export { PARTY_CALENDAR } from "./partyCalendar";
export { RIVAL_RELEASES } from "./rivalReleases";
export type { RivalRelease } from "./rivalReleases";

// ---- Economy seed ----
export { HARDWARE_CATALOG, HARDWARE_CATALOG_INDEX } from "./hardwareCatalog";
export type { HardwareItem } from "@packages/types";
export { JOB_TEMPLATES } from "./jobTemplates";
export type { JobTemplate } from "@packages/types";
export { SOFTWARE_CATALOG } from "./softwareCatalog";
export type { SoftwareOffering } from "@packages/types";
export { SPONSORSHIP_CATALOG } from "./sponsorshipCatalog";
export type { SponsorshipOffering } from "@packages/types";
