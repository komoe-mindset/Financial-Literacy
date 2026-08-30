import type { LucideIcon } from "lucide-react";

export type WorkflowTone =
  | "mint"
  | "blue"
  | "amber"
  | "pink"
  | "purple"
  | "coral"
  | "green"
  | "teal";

export interface WorkflowStep {
  id: string;
  stepNumber: number;
  short: string;
  title: string;
  en: string;
  desc: string;
  ask: string;
  icon: LucideIcon;
  tone: WorkflowTone;
}

export type LearningPathId = "personal" | "business" | "teacher";

export interface LearningPath {
  id: LearningPathId;
  title: string;
  subtitle: string;
  audience: string;
  focusAreas: string[];
  description: string;
}

export type ThirtyDayActionId =
  | "expenses"
  | "save_first"
  | "emergency"
  | "debt_total"
  | "separate_money";

export interface ThirtyDayAction {
  id: ThirtyDayActionId;
  title: string;
  description: string;
  tips: string[];
}

export interface LearningProgress {
  currentStep: number;
  completedSteps: number[];
  selectedPath: LearningPathId;
  selectedAction: ThirtyDayActionId | null;
  lastUpdated: string;
}

export interface LearningCheckQuestion {
  id: string;
  stepNumber: number;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  myanmarTerm: string;
  simpleExplanation: string;
  example: string;
  category: "basics" | "budgeting" | "business" | "debt";
}

export type CurriculumMode = "30min" | "60min" | "3hour";

export interface DetailedLessonPlanItem {
  time: string;
  stepNumber: number;
  title: string;
  learningObjective: string;
  teacherWording: string;
  studentActivity: string;
  discussionQuestion: string;
  answerGuidance: string;
  reflection: string;
  actionItem: string;
}

export interface BudgetInputs {
  income: number;
  essential: number;
  flexible: number;
  debt: number;
  saving: number;
}

export interface BudgetValidation {
  isValid: boolean;
  isIncomeZero: boolean;
  isOverAllocated: boolean;
  isSavingExceedsIncome: boolean;
  isZeroAllocation: boolean;
  hasNegative: boolean;
  message: string;
  severity: "info" | "warning" | "error" | "success";
}

export interface BudgetCalculationResult {
  totalAllocation: number;
  remaining: number;
  savingsRate: number;
  emergencyTarget: number;
  needsPercentage: number;
  flexiblePercentage: number;
  debtPercentage: number;
  validation: BudgetValidation;
}

export type DecisionType = "debt" | "save" | "simple";

export interface DecisionOption {
  id: DecisionType;
  title: string;
  subtitle: string;
  resultTitle: string;
  resultDescription: string;
  immediateBenefit: string;
  totalCost: string;
  financialRisk: string;
  opportunityCost: string;
  saferAlternative: string;
}
