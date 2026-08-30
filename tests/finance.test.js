import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calculateBudget, validateBudget } from "../src/utils/finance.ts";
import { formatMMK, formatNumber, formatK } from "../src/utils/format.ts";

describe("Financial Utilities & Budget Calculations", () => {
  test("calculates standard budget correctly", () => {
    const inputs = {
      income: 1_000_000,
      essential: 550_000,
      flexible: 150_000,
      debt: 100_000,
      saving: 200_000,
    };

    const result = calculateBudget(inputs, 3);

    assert.equal(result.totalAllocation, 1_000_000);
    assert.equal(result.remaining, 0);
    assert.equal(result.savingsRate, 20);
    assert.equal(result.emergencyTarget, 1_650_000); // 550,000 * 3
    assert.equal(result.validation.isValid, true);
    assert.equal(result.validation.isOverAllocated, false);
  });

  test("calculates remaining surplus money when allocations are below income", () => {
    const inputs = {
      income: 1_000_000,
      essential: 400_000,
      flexible: 100_000,
      debt: 50_000,
      saving: 150_000,
    };

    const result = calculateBudget(inputs, 6);

    assert.equal(result.totalAllocation, 700_000);
    assert.equal(result.remaining, 300_000);
    assert.equal(result.savingsRate, 15);
    assert.equal(result.emergencyTarget, 2_400_000); // 400,000 * 6
    assert.equal(result.validation.isValid, true);
    assert.equal(result.validation.isOverAllocated, false);
  });

  test("handles expenses exceeding income (deficit)", () => {
    const inputs = {
      income: 1_000_000,
      essential: 700_000,
      flexible: 300_000,
      debt: 200_000,
      saving: 100_000,
    };

    const result = calculateBudget(inputs, 3);

    assert.equal(result.totalAllocation, 1_300_000);
    assert.equal(result.remaining, -300_000);
    assert.equal(result.validation.isValid, false);
    assert.equal(result.validation.isOverAllocated, true);
    assert.equal(result.validation.severity, "warning");
  });

  test("handles zero income safely without NaN or division by zero", () => {
    const inputs = {
      income: 0,
      essential: 200_000,
      flexible: 50_000,
      debt: 0,
      saving: 0,
    };

    const result = calculateBudget(inputs, 3);

    assert.equal(result.savingsRate, 0);
    assert.equal(result.remaining, -250_000);
    assert.equal(result.validation.isIncomeZero, true);
    assert.equal(result.validation.isValid, false);
  });

  test("handles saving exceeding income", () => {
    const inputs = {
      income: 500_000,
      essential: 100_000,
      flexible: 50_000,
      debt: 0,
      saving: 600_000,
    };

    const result = calculateBudget(inputs, 3);

    assert.equal(result.validation.isSavingExceedsIncome, true);
    assert.equal(result.validation.isValid, false);
  });

  test("handles zero allocation when income exists", () => {
    const inputs = {
      income: 1_000_000,
      essential: 0,
      flexible: 0,
      debt: 0,
      saving: 0,
    };

    const result = calculateBudget(inputs, 3);

    assert.equal(result.totalAllocation, 0);
    assert.equal(result.remaining, 1_000_000);
    assert.equal(result.validation.isZeroAllocation, true);
  });

  test("handles negative inputs gracefully", () => {
    const inputs = {
      income: -500_000,
      essential: 100_000,
      flexible: 0,
      debt: 0,
      saving: 0,
    };

    const validation = validateBudget(inputs);
    assert.equal(validation.hasNegative, true);
    assert.equal(validation.isValid, false);
    assert.equal(validation.severity, "error");
  });
});

describe("Format Utilities", () => {
  test("formats MMK currency with thousand separators", () => {
    assert.equal(formatMMK(1_000_000), "1,000,000 MMK");
    assert.equal(formatMMK(550_000), "550,000 MMK");
    assert.equal(formatMMK(0), "0 MMK");
    assert.equal(formatMMK(NaN), "0 MMK");
  });

  test("formats number with thousand separators", () => {
    assert.equal(formatNumber(1_650_000), "1,650,000");
    assert.equal(formatNumber(0), "0");
  });

  test("formats abbreviation with K", () => {
    assert.equal(formatK(1_000_000), "1,000K");
    assert.equal(formatK(550_000), "550K");
    assert.equal(formatK(0), "0K");
  });
});
