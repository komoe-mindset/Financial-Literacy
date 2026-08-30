import type { BudgetInputs, BudgetCalculationResult, BudgetValidation } from "../types";

/**
 * Validates budget inputs and produces a localized Myanmar feedback message.
 */
export function validateBudget(inputs: BudgetInputs): BudgetValidation {
  const { income, essential, flexible, debt, saving } = inputs;

  const hasNegative =
    income < 0 || essential < 0 || flexible < 0 || debt < 0 || saving < 0;

  if (hasNegative) {
    return {
      isValid: false,
      isIncomeZero: income === 0,
      isOverAllocated: false,
      isSavingExceedsIncome: false,
      isZeroAllocation: false,
      hasNegative: true,
      message: "အနှုတ်ဂဏန်းများ ထည့်သွင်း၍မရပါ။ သုည (၀) သို့မဟုတ် အပေါင်းဂဏန်းသာ ထည့်ပါ။",
      severity: "error",
    };
  }

  if (income === 0) {
    return {
      isValid: false,
      isIncomeZero: true,
      isOverAllocated: false,
      isSavingExceedsIncome: false,
      isZeroAllocation: false,
      hasNegative: false,
      message: "ဝင်ငွေထည့်သွင်းပေးပါ။ ဝင်ငွေမရှိပါက စုငွေနှင့် အသုံးစရိတ်ခွဲဝေမှု မတွက်ချက်နိုင်ပါ။",
      severity: "info",
    };
  }

  const totalAllocation = essential + flexible + debt + saving;

  if (totalAllocation === 0) {
    return {
      isValid: true,
      isIncomeZero: false,
      isOverAllocated: false,
      isSavingExceedsIncome: false,
      isZeroAllocation: true,
      hasNegative: false,
      message: "ဝင်ငွေအားလုံး မခွဲဝေရသေးပါ။ မဖြစ်မနေအသုံးစရိတ်နှင့် စုဆောင်းငွေအတွက် စီမံခွဲဝေပါ။",
      severity: "info",
    };
  }

  if (saving > income) {
    return {
      isValid: false,
      isIncomeZero: false,
      isOverAllocated: totalAllocation > income,
      isSavingExceedsIncome: true,
      isZeroAllocation: false,
      hasNegative: false,
      message: "စုဆောင်းငွေသည် တစ်လဝင်ငွေထက် ပိုများနေပါသည်။ စုငွေပမာဏကို ပြန်လည်ညှိနှိုင်းပါ။",
      severity: "warning",
    };
  }

  if (totalAllocation > income) {
    return {
      isValid: false,
      isIncomeZero: false,
      isOverAllocated: true,
      isSavingExceedsIncome: false,
      isZeroAllocation: false,
      hasNegative: false,
      message: "စုစုပေါင်းခွဲဝေမှုသည် ဝင်ငွေထက် ပိုများနေပါသည်။ Flexible Expense သို့မဟုတ် အခြားအသုံးစရိတ်ကို အရင်ပြန်စိစစ်ပါ။",
      severity: "warning",
    };
  }

  if (totalAllocation === income) {
    return {
      isValid: true,
      isIncomeZero: false,
      isOverAllocated: false,
      isSavingExceedsIncome: false,
      isZeroAllocation: false,
      hasNegative: false,
      message: "Zero-based Budget: ဝင်ငွေအားလုံးကို ရည်ရွယ်ချက်ရှိရှိ အပြည့်အဝ ခွဲဝေထားနိုင်ပါသည်။",
      severity: "success",
    };
  }

  return {
    isValid: true,
    isIncomeZero: false,
    isOverAllocated: false,
    isSavingExceedsIncome: false,
    isZeroAllocation: false,
    hasNegative: false,
    message: "ကျန်ရှိသောငွေကို Emergency Fund သို့မဟုတ် အခြားဘဏ္ဍာရေးရည်မှန်းချက်အတွက် ထပ်မံခွဲထားနိုင်ပါသည်။",
    severity: "success",
  };
}

/**
 * Calculates budget summary including remaining balance, savings rate, and emergency fund target.
 */
export function calculateBudget(
  inputs: BudgetInputs,
  emergencyMonths: number = 3
): BudgetCalculationResult {
  const safeIncome = Math.max(0, inputs.income || 0);
  const safeEssential = Math.max(0, inputs.essential || 0);
  const safeFlexible = Math.max(0, inputs.flexible || 0);
  const safeDebt = Math.max(0, inputs.debt || 0);
  const safeSaving = Math.max(0, inputs.saving || 0);
  const safeMonths = Math.max(1, emergencyMonths || 3);

  const totalAllocation = safeEssential + safeFlexible + safeDebt + safeSaving;
  const remaining = safeIncome - totalAllocation;
  const savingsRate = safeIncome > 0 ? (safeSaving / safeIncome) * 100 : 0;
  const emergencyTarget = safeEssential * safeMonths;

  const needsPercentage = safeIncome > 0 ? (safeEssential / safeIncome) * 100 : 0;
  const flexiblePercentage = safeIncome > 0 ? (safeFlexible / safeIncome) * 100 : 0;
  const debtPercentage = safeIncome > 0 ? (safeDebt / safeIncome) * 100 : 0;

  const validation = validateBudget(inputs);

  return {
    totalAllocation,
    remaining,
    savingsRate,
    emergencyTarget,
    needsPercentage,
    flexiblePercentage,
    debtPercentage,
    validation,
  };
}
