/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Economy projection \u2014 a pure read-only view of `WorldState.economy *`
 * combined with the typed seed catalogs (`@sim/data/hardwareCatalog`,
 * `jobTemplates`, `softwareCatalog`, `sponsorshipCatalog`).
 *
 * Projections (docs/architecture.md, /sim/projections) MUST:
 *   - Be pure: take (state, …\u00a0inputs) and return a view-shaped object.
 *     NEVER mutate WorldState, NEVER dispatch events.
 *   - Never import React, DOM, fetch, LLM APIs.
 *   - Subscribe to `eventStore` ONLY from the caller in /apps/ui \u2014 the
 *     projection itself does not register listeners (it is a function, not
 *     a class), so the StrictMode double-invocation of effects cannot
 *     double-fire UI updates through this projection.
 *
 * EconomicsView is deliberately shaped for direct JSX consumption: the UI
 * layer (apps/ui) can render every counter and list directly without any
 * additional aggregation. App.tsx-style newcomers should call
 * `economicsView(state, …)` once per render, not memoize, not subscribe.
 */

// HardwareCategory, IncomeSource, ExpenseCategory are all enums: their
// materialisations (e.g. IncomeSource.FreelanceCoding) are used as values
// in the enum-member switch cases below. They must be imported via a
// regular `import`, not `import type`. The rest are TYPE-only.
import {
  ExpenseCategory,
  HardwareCategory,
  IncomeSource,
} from "@packages/types";
import type {
  ActiveJob,
  ExpenseLedgerEntry,
  HardwareItem,
  IncomeLedgerEntry,
  JobTemplate,
  NetWorthSnapshot,
  OwnedHardware,
  OwnedSoftware,
  SponsorshipOffering,
  TravelSubscriptionTier,
} from "@packages/types";

import type { WorldState } from "@sim/engine/reducer";

import {
  HARDWARE_CATALOG,
  HARDWARE_CATALOG_INDEX,
  JOB_TEMPLATES,
  SOFTWARE_CATALOG,
  SPONSORSHIP_CATALOG,
} from "@sim/data";

/**
 * Build a complete economy view from WorldState + the seed catalogs.
 *
 * Pure function. No internal state, no event emission, no I/O.
 */
export function economicsView(
  state: WorldState,
): EconomyView {
  const currentYear = state.calendar.year;
  const income = state.economy.ledger.income;
  const expense = state.economy.ledger.expense;
  const totalEarned = income.reduce((sum, e) => sum + e.amount, 0);
  const totalSpent = expense.reduce((sum, e) => sum + e.amount, 0);
  const balance = state.player.money;
  const pendingJobPayouts = state.economy.jobs.active
    .filter((j) => j.status === "in_progress")
    .reduce((sum, j) => sum + expectedJobPayoutForJob(j, state), 0);
  const hardwareResaleValue = state.economy.hardware.reduce((sum, h) => {
    const item = HARDWARE_CATALOG_INDEX.get(h.itemId);
    if (!item) return sum;
    return sum + Math.round(item.purchasePrice * item.resaleValueFraction);
  }, 0);
  const softwareApproxValue = state.economy.software.reduce((sum, s) => {
    const offering = SOFTWARE_CATALOG.find((o) => o.id === s.softwareId);
    return sum + (offering ? Math.round(offering.purchasePrice * 0.4) : 0);
  }, 0);
  const netWorth: NetWorthSnapshot = {
    cash: balance,
    hardwareResaleValue,
    softwareApproxValue,
    pendingJobPayouts,
    total: balance + hardwareResaleValue + softwareApproxValue + pendingJobPayouts,
  };
  const hardwareDetails: HardwareOwnedDetail[] = state.economy.hardware.map((h) => {
    const item = HARDWARE_CATALOG_INDEX.get(h.itemId);
    return {
      instance: h,
      item: item ?? null,
      resaleValue:
        item === undefined
          ? 0
          : Math.round(item.purchasePrice * item.resaleValueFraction),
      // Wear climbs 1pt per quarter-year of use, capped at 100. Pure
      // derivation; nothing about this depends on dispatched events.
      currentWear: simulatedWearLevelFor(h, currentYear, state.calendar.month),
    };
  });
  const softwareDetails: SoftwareOwnedDetail[] = state.economy.software.map((s) => {
    const offering = SOFTWARE_CATALOG.find((o) => o.id === s.softwareId);
    return { owned: s, software: offering ?? null };
  });
  const availableHardware = HARDWARE_CATALOG.filter(
    (item) => item.releaseYear <= currentYear,
  );
  const enrichedJobs: JobWithPayout[] = state.economy.jobs.active.map((j) => {
    const template = JOB_TEMPLATES.find((t) => t.id === j.templateId);
    return {
      job: j,
      template: template ?? null,
      expectedPayout: expectedJobPayoutForJob(j, state),
    };
  });
  const suggestedJobs = JOB_TEMPLATES.filter(
    (t) =>
      t.availableFromYear <= currentYear &&
      currentYear <= t.availableToYear &&
      !state.economy.jobs.active.some((j) => j.templateId === t.id),
  );
  const availableSponsorships = SPONSORSHIP_CATALOG.filter(
    (s) =>
      s.availableFromYear <= currentYear &&
      state.player.reputation >= s.minReputation,
  );
  const recentTransactions: Array<
    | { kind: "income"; entry: IncomeLedgerEntry }
    | { kind: "expense"; entry: ExpenseLedgerEntry }
  > = [
    ...income.map((e) => ({ kind: "income" as const, entry: e })),
    ...expense.map((e) => ({ kind: "expense" as const, entry: e })),
  ]
    .sort((a, b) => {
      const aTs = a.entry.year * 12 + a.entry.month;
      const bTs = b.entry.year * 12 + b.entry.month;
      return bTs - aTs;
    })
    .slice(0, 10);
  return {
    balance,
    totalEarned,
    totalSpent,
    netWorth,
    pendingJobPayouts,
    hardwareInventory: hardwareDetails,
    softwareInventory: softwareDetails,
    availableHardware,
    activeJobs: enrichedJobs,
    suggestedJobs,
    availableSponsorships,
    recentTransactions,
    travelSubscription: state.economy.travel.activeSubscription,
    lastTravelToPartyId: state.economy.travel.lastTravelToPartyId,
    canAfford: (price: number): boolean => balance >= price,
  };
}

// ---------------------------------------------------------------------------
// Shape of the derived view that /apps/ui consumes.
// ---------------------------------------------------------------------------

export interface EconomyView {
  /** Cash on hand \u2014 mirrors state.player.money (kept in lock-step). */
  balance: number;
  /** Sum of all positive ledger entries across the entire run. */
  totalEarned: number;
  /** Sum of all expense ledger entries across the entire run. */
  totalSpent: number;
  /** Net-worth snapshot: cash + hardware resale + software approx + pending payouts. */
  netWorth: NetWorthSnapshot;
  /** Sum of in_progress job payouts the player will collect on completion. */
  pendingJobPayouts: number;
  /** Per-instance owned hardware, joined with catalog row + wear decay. */
  hardwareInventory: HardwareOwnedDetail[];
  softwareInventory: SoftwareOwnedDetail[];
  /** Catalog filter: HARDWARE_CATALOG items whose releaseYear <= currentYear. */
  availableHardware: HardwareItem[];
  /** Active jobs joined with their templates and trust-weighted expected payouts. */
  activeJobs: JobWithPayout[];
  /** Job templates currently visible to the player. */
  suggestedJobs: JobTemplate[];
  /** Sponsorship deals unlocked by current reputation + year. */
  availableSponsorships: SponsorshipOffering[];
  /** Newest 10 ledger entries (income + expense) for an "activity" panel. */
  recentTransactions: Array<
    | { kind: "income"; entry: IncomeLedgerEntry }
    | { kind: "expense"; entry: ExpenseLedgerEntry }
  >;
  /** Convenience: lockstep with state.economy.travel.activeSubscription. */
  travelSubscription: TravelSubscriptionTier;
  lastTravelToPartyId: string | null;
  /** Pure affordability check; mirrors a \"can I buy this?\" UI prompt. */
  canAfford: (price: number) => boolean;
}

export interface HardwareOwnedDetail {
  instance: OwnedHardware;
  item: HardwareItem | null;
  resaleValue: number;
  /** Wear level recomputed deterministically from purchaseTime vs currentTime. */
  currentWear: number;
}

export interface SoftwareOwnedDetail {
  owned: OwnedSoftware;
  software: import("@packages/types").SoftwareOffering | null;
}

export interface JobWithPayout {
  job: ActiveJob;
  template: JobTemplate | null;
  /** Trust-weighted expected payout. Falls back to template.basePayment. */
  expectedPayout: number;
}

// ---------------------------------------------------------------------------
// Helpers kept here so the projection owns its interpretation rules.
// Pure, no side effects.
// ---------------------------------------------------------------------------

/**
 * Determine current wear level for an OwnedHardware given the simulation
 * calendar. Pure derivation \u2014 not persisted, so the reducer does NOT
 * store it. Progresses ~3 pts per year for average hardware, slightly
 * faster for low-reliability parts. Clamped at 100.
 */
export function simulatedWearLevelFor(
  owned: OwnedHardware,
  currentYear: number,
  currentMonth: number,
): number {
  const item = HARDWARE_CATALOG_INDEX.get(owned.itemId);
  const ageYears = currentYear - owned.purchaseYear;
  const ageMonths = currentMonth - owned.purchaseMonth;
  const decimalAge = ageYears + ageMonths / 12;
  const reliabilityBonus = item ? (100 - item.reliability) / 25 : 0;
  return Math.min(100, Math.round(owned.wearLevel + decimalAge * (3 + reliabilityBonus)));
}

/**
 * Trust-weighted expected job payout. Reads `state.crew.characters[npcId].cognitive.trustGraph`
 * for the player row, multiplies by [0.85 .. 1.35] band, optionally floors
 * to basePayment. Pure \u2014 safe to call from /sim, /apps/ui, projections.
 *
 * Note: we use the `__player__` key as a stable alias for the player's own
 * node in each NPC's trust graph; the CrewHired / NpcOpinionDrifted flow
 * keeps that up-to-date through existing event handlers.
 */
export function expectedJobPayment(
  template: JobTemplate,
  state: WorldState,
): number {
  if (!template.npcProviderId) return template.basePayment;
  const provider = state.crew.characters[template.npcProviderId];
  const trustPercent =
    provider && provider.cognitive ? provider.cognitive.trustGraph["__player__"] ?? 50 : 50;
  // Trust: 0 -> 0.85; 50 -> 1.10; 100 -> 1.35.
  const multiplier = 0.85 + (trustPercent / 100) * 0.5;
  return Math.max(
    Math.round(template.basePayment * 0.7),
    Math.round(template.basePayment * multiplier),
  );
}

/**
 * Symmetric helper for an in-flight Job \u2014 same multiplier logic keyed off
 * the job's npcProviderId rather than the template's preferred provider.
 */
export function expectedJobPayoutForJob(
  job: ActiveJob,
  state: WorldState,
): number {
  const template = JOB_TEMPLATES.find((t) => t.id === job.templateId);
  if (!template) return 0;
  if (!job.npcProviderId) return template.basePayment;
  const provider = state.crew.characters[job.npcProviderId];
  const trustPercent =
    provider && provider.cognitive
      ? provider.cognitive.trustGraph["__player__"] ?? 50
      : 50;
  const multiplier = 0.85 + (trustPercent / 100) * 0.5;
  return Math.max(
    Math.round(template.basePayment * 0.7),
    Math.round(template.basePayment * multiplier),
  );
}

/** Map an IncomeSource union to a friendly UI label without UI strings in /sim. */
export function describeIncomeSource(source: IncomeSource): string {
  // Enum-member form (IncomeSource.X) is required so TypeScript narrows
  // `source` to `never` after the exhaustive switch. String-literal
  // cases fail to narrow when the union was imported via `import type`.
  switch (source) {
    case IncomeSource.FreelanceCoding:
      return "Freelance coding job";
    case IncomeSource.FreelanceGraphics:
      return "Freelance graphics job";
    case IncomeSource.MusicCommission:
      return "Music commission";
    case IncomeSource.PartyPrize:
      return "Party prize money";
    case IncomeSource.Shareware:
      return "Shareware sales";
    case IncomeSource.Sponsorship:
      return "Sponsorship grant";
    case IncomeSource.Refund:
      return "Refund";
    case IncomeSource.Other:
      return "Other income";
    default: {
      const _exhaust: never = source;
      void _exhaust;
      return "Income";
    }
  }
}

/** Symmetric label helper for an ExpenseCategory. */
export function describeExpenseCategory(category: ExpenseCategory): string {
  switch (category) {
    case ExpenseCategory.Hardware:
      return "Hardware purchase";
    case ExpenseCategory.Software:
      return "Software purchase";
    case ExpenseCategory.Travel:
      return "Travel expense";
    case ExpenseCategory.PartyEntry:
      return "Party entry fee";
    case ExpenseCategory.Salary:
      return "Crew salary";
    case ExpenseCategory.Rent:
      return "Office rent";
    case ExpenseCategory.Internet:
      return "Internet subscription";
    case ExpenseCategory.Maintenance:
      return "Maintenance";
    case ExpenseCategory.Refund:
      return "Refund";
    case ExpenseCategory.Other:
      return "Other expense";
    default: {
      const _exhaust: never = category;
      void _exhaust;
      return "Expense";
    }
  }
}

/**
 * Group owned hardware by category \u2014 used by the upgrade tooltip / studio
 * panel. Pure aggregation; the projection call above does not group, so the
 * UI can call this with `view.hardwareInventory`.
 */
export function hardwareGroupedByCategory(
  inventory: readonly HardwareOwnedDetail[],
): Record<HardwareCategory, HardwareOwnedDetail[]> {
  const buckets: Record<HardwareCategory, HardwareOwnedDetail[]> = {
    [HardwareCategory.CPU]: [],
    [HardwareCategory.GPU]: [],
    [HardwareCategory.Memory]: [],
    [HardwareCategory.Storage]: [],
    [HardwareCategory.Audio]: [],
    [HardwareCategory.Monitor]: [],
    [HardwareCategory.Other]: [],
  };
  for (const detail of inventory) {
    if (!detail.item) continue;
    buckets[detail.item.category].push(detail);
  }
  return buckets;
}

/** Sum the catalogue performance score of owned hardware in one bucket. */
export function totalPerformanceByCategory(
  inventory: readonly HardwareOwnedDetail[],
  category: HardwareCategory,
): number {
  return inventory.reduce((sum, h) => {
    if (!h.item || h.item.category !== category) return sum;
    // Performance gets demoted by 0.5% per wear point above 50 to teach
    // the user that reliability matters.
    const wearPenalty = Math.max(0, h.currentWear - 50) * 0.005;
    return sum + h.item.performanceScore * (1 - wearPenalty);
  }, 0);
}
