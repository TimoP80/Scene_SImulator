/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Economy types — hardware entities, freelance job templates, software
 * offerings, sponsorship deals, and the income/expense ledger entries that
 * are written by MoneyEarned / MoneySpent events (see sim/events/eventTypes.ts).
 *
 * Pure data structures. NO React, NO LLM, NO side effects.
 *
 * Hard rules (docs/architecture.md):
 *   - This file lives under /packages/types — the *only* place sim-facing
 *     type declarations may exist. Any code in /sim or /apps importing a
 *     sim-facing type imports it from `@packages/types` and NEVER redeclares.
 *   - All financial state is derived from events (MoneyEarned / MoneySpent).
 *     The current balance is held in `WorldState.player.money` for fast
 *     referential reads AND is also sum-derivable from
 *     `WorldState.economy.ledger.{income,expense}`.
 *   - LLMs MUST NOT make economic decisions. AI systems may SUGGEST a
 *     candidate action (which then goes through dispatch()), but the loop
 *     and the reducer own the truth.
 */

/**
 * Hardware categories. The dx-style loose groupings (CPU / GPU / Memory /
 * Storage / Audio / Monitor) let the studio tooltip show what a rig upgrade
 * actually improves; legacy `Other` keeps new entrants extensible without
 * breaking the existing exhaustive `Record<HardwareCategory, …>` shapes.
 */
export enum HardwareCategory {
  CPU = "CPU",
  GPU = "GPU",
  Memory = "Memory",
  Storage = "Storage",
  Audio = "Audio",
  Monitor = "Monitor",
  Other = "Other",
}

/** Source attribution for a `MoneyEarned` event. Projections pivot on this. */
export enum IncomeSource {
  FreelanceCoding = "FreelanceCoding",
  FreelanceGraphics = "FreelanceGraphics",
  MusicCommission = "MusicCommission",
  PartyPrize = "PartyPrize",
  Shareware = "Shareware",
  Sponsorship = "Sponsorship",
  Refund = "Refund",
  Other = "Other",
}

/** Category attribution for a `MoneySpent` event. */
export enum ExpenseCategory {
  Hardware = "Hardware",
  Software = "Software",
  Travel = "Travel",
  PartyEntry = "PartyEntry",
  Salary = "Salary",
  Rent = "Rent",
  Internet = "Internet",
  Maintenance = "Maintenance",
  Refund = "Refund",
  Other = "Other",
}

/**
 * Catalog item — a *kind* of hardware that becomes purchasable once the
 * simulation calendar passes its `releaseYear`. HardwarePurchased events
 * stamp `condition: "new" | "refurbished"` at purchase time so the wearLevel
 * of the resulting OwnedHardware can be derived deterministically from
 * year/month deltas (see sim/domain/economy.ts `simulatedWearLevelFor`).
 */
export interface HardwareItem {
  id: string;
  name: string;
  category: HardwareCategory;
  releaseYear: number;
  /** 1-100 score used by domain/economy.ts `totalPerformanceByCategory`. */
  performanceScore: number;
  /** Catalog price in cash at the time of release. */
  purchasePrice: number;
  /**
   * Fraction (0-1) of purchasePrice that hardware commands at resale.
   * Older rigs depreciate; GPU/CPU have steeper slopes. Used by the
   * `HardwareSold` event payload helper.
   */
  resaleValueFraction: number;
  /** 1-100 reliability score; lower scores burn out faster. */
  reliability: number;
  /** Power draw in watts; informs monthly electricity expense (out of scope today). */
  powerConsumption: number;
  description: string;
}

/** Per-instance record. One `HardwarePurchased` event produces one of these. */
export interface OwnedHardware {
  instanceId: string;
  itemId: string;
  purchaseYear: number;
  purchaseMonth: number;
  condition: "new" | "refurbished" | "used";
  /**
   * 0-100 wear level. Initial value is set by the reducer from
   * `condition` (`new` = 0, `refurbished` = 30, `used` = 60). It can be
   * advanced by future events (e.g. hardware failures) — none today.
   */
  wearLevel: number;
}

/**
 * Software catalog item. Once purchased (SoftwarePurchased event), the
 * software unlocks effectIds in the TECHNOLOGY_TREE-driven compile pipeline.
 */
export interface SoftwareOffering {
  id: string;
  name: string;
  type:
    | "assembler"
    | "ide"
    | "tracker"
    | "image_editor"
    | "mod_player"
    | "compressor"
    | "utility";
  releaseYear: number;
  purchasePrice: number;
  /** DemoEffect ids the tool unlocks once owned (join with sim/data/demoEffects.ts). */
  effectUnlocks: string[];
  description: string;
}

export interface OwnedSoftware {
  softwareId: string;
  purchasedYear: number;
  purchasedMonth: number;
  currentlyUsable: boolean;
}

/**
 * Freelance/job template — TYPES of work the player can accept. JobAccepted
 * events materialize these into `ActiveJob` instances with their own deadlines.
 */
export interface JobTemplate {
  id: string;
  type:
    | "freelance_coding"
    | "freelance_graphics"
    | "music_commission"
    | "tool_contract"
    | "shareware_release";
  name: string;
  description: string;
  basePayment: number;
  reputationDelta: number;
  durationMonths: number;
  /** Optional gating: requires a crew member with at least this skill. */
  requiresCrewSkill?: "coding" | "music" | "graphics" | "organization";
  /** Optional NPC provider. If set, npcProviderId is fixed at acceptance. */
  npcProviderId?: string;
  /** Years where the template is most likely offered (in-game availability band). */
  availableFromYear: number;
  availableToYear: number;
}

/**
 * A live job. Created by JobAccepted, finished by JobCompleted.
 * Status is the canonical state machine:
 *   "in_progress"  → reducer-stamped on JobAccepted.
 *                    domain/economy.ts `advanceJobDueDates` (calendar tick)
 *                    may flip it to "completed" (success) deterministically.
 *   "completed"    → terminal.
 *   "failed"       → terminal (zero payout, low reputation hit on next tick).
 */
export interface ActiveJob {
  instanceId: string;
  templateId: string;
  npcProviderId?: string;
  acceptedYear: number;
  acceptedMonth: number;
  /**
   * Optional: progress is computed deterministically from
   *   (currentYear, currentMonth, acceptedYear, acceptedMonth, durationMonths).
   * Stored separately so callers can read it without re-running the domain
   * math, and so a future visual feedback can shade the job progress bar.
   */
  progressPct: number;
  deadlineYear: number;
  deadlineMonth: number;
  status: "in_progress" | "completed" | "failed";
}

/**
 * Optional referral sponsorship deal. Tied to a specific achievement; only
 * fires once the achievement is reflected in `state.crew.characters[id].reputation`
 * (existing per-character reputation; no new event type required). LLM MUST
 * NOT make the decision to accept — dispatcher routes it through prompt UI.
 */
export interface SponsorshipOffering {
  id: string;
  sponsorName: string;
  description: string;
  /** Minimum player reputation to unlock. */
  minReputation: number;
  /** Minimum calendar year the deal unlocks at. */
  availableFromYear: number;
  cashPayment: number;
  /** Bonus cash per rank when player places 1st, 2nd, 3rd at a party. */
  partyPlacementBonus: number;
  /** Optional flavor: "Amiga hardware", "Software dev tools", etc. */
  flavorTag: string;
}

/**
 * MoneyEarned ledger entry — written into state.economy.ledger.income.
 *   sourceId is generated by appendEvent via generateId (see sim/events/).
 *   sourceRefId points at a JobTemplate / PartyName / SponsorshipOffering /
 *   Bulletin id so a UI can link the income row to the originating context.
 */
export interface IncomeLedgerEntry {
  id: string;
  year: number;
  month: number;
  amount: number;
  source: IncomeSource;
  sourceRefId?: string;
}

/** Symmetric expense entry (see sim/events MoneySpent). */
export interface ExpenseLedgerEntry {
  id: string;
  year: number;
  month: number;
  amount: number;
  category: ExpenseCategory;
  purchasedItem?: { kind: "hardware" | "software"; itemId: string };
  sourceRefId?: string;
}

/** Internet subscription tier the player carries (BBS use, scene calls). */
export type TravelSubscriptionTier = "none" | "bbs_basic" | "high_speed" | "unlimited";

/**
 * Net-worth snapshot helper for projections / domain.
 * Decoupled from `WorldState.player.money` so promotion paths can feature
 * "net wealth" milestones (cash + hardware resale) without inventing new
 * events.
 */
export interface NetWorthSnapshot {
  cash: number;
  hardwareResaleValue: number;
  softwareApproxValue: number;
  pendingJobPayouts: number;
  total: number;
}
