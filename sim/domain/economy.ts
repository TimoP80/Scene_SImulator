/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Economy domain helpers \u2014 pure, side-effect-free rules for the economy
 * subsystem. Mirrors sim/domain/party.ts in spirit (per-platform focus
 * band maps) but for the cash / hardware / freelance subsystem.
 *
 * Per docs/architecture.md and simulation-rules.md:
 *   - NO React / DOM / fetch / LLM imports anywhere in /sim.
 *   - NO mutation of WorldState.
 *   - Pure functions only \u2014 safe to call from the reducer, projections,
 *     /apps/ui, and /tools.
 */

import type {
  HardwareCategory,
  HardwareItem,
  JobTemplate,
  TravelSubscriptionTier,
} from "@packages/types";

/**
 * Public \u2014 returns the subset of `catalog` that's purchasable at `year`.
 * Strictly deterministic: an item is available iff `releaseYear <= year`.
 * Re-implements the equivalent algorithm in sim/projections/economy.ts so
 * domain code that does NOT need the full EconomyView can still filter.
 */
export function hardwareAvailableAtYear(
  catalog: readonly HardwareItem[],
  year: number,
): HardwareItem[] {
  return catalog.filter((item) => item.releaseYear <= year);
}

/**
 * Aggregate performance across owned hardware instances, optionally
 * scoped to a category. Pure aggregation, no state mutation.
 */
export function aggregatePerformance(
  inventory: readonly { item: HardwareItem; wearLevel: number }[],
  category?: HardwareCategory,
): number {
  return inventory.reduce((sum, h) => {
    if (category !== undefined && h.item.category !== category) return sum;
    const wearPenalty = Math.max(0, h.wearLevel - 50) * 0.005;
    return sum + h.item.performanceScore * (1 - wearPenalty);
  }, 0);
}

/**
 * Compute the expected payout for a job at the moment of acceptance.
 * `trustWithPlayer` expected in [0, 100]; falls back to 50 (the neutral
 * baseline used by the projection). Pure \u2014 same numbers as
 * `expectedJobPayment` in sim/projections/economy.ts; duplicated here
 * so callers that don't want the full EconomyView don't drag the
 * projection layer into their import graph.
 */
export function jobAcceptancePayout(
  template: JobTemplate,
  trustWithPlayer: number | undefined,
): number {
  const trust = trustWithPlayer ?? 50;
  const multiplier = 0.85 + (trust / 100) * 0.5;
  return Math.max(
    Math.round(template.basePayment * 0.7),
    Math.round(template.basePayment * multiplier),
  );
}

/**
 * Monthly cost for the player's internet subscription, indexed by tier.
 * Pure lookup; the calendar-tick projection applies the debit by
 * dispatching MoneySpent each month (only when tier !== "none").
 */
export function monthlySubscriptionFee(
  tier: TravelSubscriptionTier,
): number {
  switch (tier) {
    case "none":
      return 0;
    case "bbs_basic":
      return 15;
    case "high_speed":
      return 35;
    case "unlimited":
      return 75;
    default: {
      const _exhaust: never = tier;
      void _exhaust;
      return 0;
    }
  }
}

/**
 * Estimate the cash a hardware component returns at resale by depreciating
 * the catalogue purchase price through `resaleValueFraction`. Pure.
 * Used by `netWorth` aggregates.
 */
export function catalogResaleValue(item: HardwareItem): number {
  return Math.round(item.purchasePrice * item.resaleValueFraction);
}

/**
 * Net-worth helper that returns the same shape `economicsView.netWorth`
 * produces without dragging the projection graph in. Pure.
 */
export interface DomainNetWorth {
  cash: number;
  hardwareResaleValue: number;
  softwareApproxValue: number;
  pendingJobPayouts: number;
  total: number;
}

export function computeNetWorth(input: {
  cash: number;
  hardware: readonly { item: HardwareItem; wearLevel: number }[];
  softwareCount: number;
  pendingJobPayouts: number;
}): DomainNetWorth {
  const hardwareResaleValue = input.hardware.reduce(
    (sum, h) => sum + catalogResaleValue(h.item),
    0,
  );
  const softwareApproxValue = input.softwareCount * 40; // crude average
  return {
    cash: input.cash,
    hardwareResaleValue,
    softwareApproxValue,
    pendingJobPayouts: input.pendingJobPayouts,
    total:
      input.cash +
      hardwareResaleValue +
      softwareApproxValue +
      input.pendingJobPayouts,
  };
}
