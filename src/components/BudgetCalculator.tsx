import { useState, useId } from "react";
import { ShieldCheck, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { formatMMK } from "../utils/format";
import { calculateBudget } from "../utils/finance";
import type { BudgetInputs } from "../types";

interface MoneyInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  helperText?: string;
}

function MoneyInputField({ id, label, value, onChange, helperText }: MoneyInputProps) {
  return (
    <div className="money-input-group">
      <label htmlFor={id} className="money-input">
        <span>{label}</span>
        <div>
          <input
            id={id}
            type="number"
            min="0"
            step="10000"
            max="10000000000"
            value={value === 0 ? "" : value}
            placeholder="0"
            onChange={(e) => {
              const raw = e.target.value.trim();
              if (raw === "") {
                onChange(0);
                return;
              }
              const num = Number(raw);
              onChange(Number.isFinite(num) ? Math.max(0, num) : 0);
            }}
            aria-describedby={helperText ? `${id}-help` : undefined}
          />
          <small aria-hidden="true">MMK</small>
        </div>
      </label>
      {helperText && (
        <span id={`${id}-help`} className="sr-only">
          {helperText}
        </span>
      )}
    </div>
  );
}

export function BudgetCalculator() {
  const [inputs, setInputs] = useState<BudgetInputs>({
    income: 1_000_000,
    essential: 550_000,
    flexible: 150_000,
    debt: 100_000,
    saving: 200_000,
  });

  const [fundMonths, setFundMonths] = useState<number>(3);
  const incomeId = useId();
  const essentialId = useId();
  const flexibleId = useId();
  const debtId = useId();
  const savingId = useId();

  const updateField = (field: keyof BudgetInputs, val: number) => {
    setInputs((prev) => ({ ...prev, [field]: val }));
  };

  const result = calculateBudget(inputs, fundMonths);
  const { validation } = result;

  return (
    <div className="lab-panel" role="region" aria-label="Budget Calculator Panel">
      <div className="calculator-copy">
        <p className="mini-label">လက်တွေ့စမ်းကြည့်ပါ</p>
        <h3>တစ်လစာ Budget တည်ဆောက်မယ်</h3>
        <p>
          နံပါတ်တွေကို ပြောင်းကြည့်ပါ။ သုံးစွဲမှု၊ ကျန်ငွေနဲ့ စုငွေနှုန်း ဘယ်လိုပြောင်းလဲသလဲ ချက်ချင်းမြင်ရပါမယ်။
        </p>
        <div className="formula" aria-label="ကျန်ငွေ တွက်ချက်နည်း ဖော်မြူလာ">
          ကျန်ငွေ = ဝင်ငွေ − စုစုပေါင်းခွဲဝေမှု
        </div>

        <div className="fund-choice">
          <span>Emergency Fund ရည်မှန်းချက်</span>
          <div role="group" aria-label="Emergency Fund အတွက် လအရေအတွက် ရွေးချယ်ရန်">
            {[1, 3, 6].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setFundMonths(m)}
                className={fundMonths === m ? "selected" : ""}
                aria-pressed={fundMonths === m}
                aria-label={`${m} လစာ Emergency Fund ရည်မှန်းချက်`}
              >
                {m} လ
              </button>
            ))}
          </div>
        </div>

        <div className="target-card" aria-live="polite">
          <ShieldCheck size={26} aria-hidden="true" />
          <span>
            လိုအပ်တဲ့ Emergency Fund ({fundMonths} လစာ)
            <small>{formatMMK(result.emergencyTarget)}</small>
          </span>
        </div>

        <div className="calc-disclaimer">
          <Info size={14} aria-hidden="true" />
          <small>ပညာပေး ရည်ရွယ်ချက်အတွက် ခန့်မှန်းတွက်ချက်မှုသာ ဖြစ်ပါသည်။</small>
        </div>
      </div>

      <div className="calculator-form">
        <MoneyInputField
          id={incomeId}
          label="တစ်လဝင်ငွေ"
          value={inputs.income}
          onChange={(v) => updateField("income", v)}
          helperText="လစဉ် ပုံမှန်ရရှိသော စုစုပေါင်းဝင်ငွေ"
        />
        <MoneyInputField
          id={essentialId}
          label="မဖြစ်မနေအသုံးစရိတ်"
          value={inputs.essential}
          onChange={(v) => updateField("essential", v)}
          helperText="အိမ်လခ၊ စားစရိတ်၊ မီးဖိုး စသည့် Needs"
        />
        <MoneyInputField
          id={flexibleId}
          label="ပြောင်းလဲနိုင်သောအသုံးစရိတ်"
          value={inputs.flexible}
          onChange={(v) => updateField("flexible", v)}
          helperText="အပြင်ထွက်စားခြင်း၊ ဖျော်ဖြေရေး စသည့် Wants"
        />
        <MoneyInputField
          id={debtId}
          label="အကြွေးပေးဆပ်မှု"
          value={inputs.debt}
          onChange={(v) => updateField("debt", v)}
          helperText="လစဉ် ပုံမှန်ဆပ်နေရသော အကြွေးအရစ်ကျ"
        />
        <MoneyInputField
          id={savingId}
          label="စုဆောင်းငွေ"
          value={inputs.saving}
          onChange={(v) => updateField("saving", v)}
          helperText="အနာဂတ်နှင့် Emergency အတွက် ဖယ်ထားသောငွေ"
        />

        {/* Validation & Feedback Box */}
        <div
          className={`calculation-result ${
            validation.severity === "error" || validation.isOverAllocated
              ? "negative"
              : validation.severity === "warning"
              ? "warning"
              : ""
          }`}
          role="status"
          aria-live="polite"
        >
          <div>
            <span>လကုန်မှာကျန်ငွေ</span>
            <strong>{formatMMK(result.remaining)}</strong>
          </div>
          <div>
            <span>စုငွေနှုန်း</span>
            <strong>
              {inputs.income > 0 ? `${result.savingsRate.toFixed(0)}%` : "0%"}
            </strong>
          </div>

          <p className="validation-text">
            {validation.severity === "error" || validation.isOverAllocated ? (
              <AlertCircle size={14} aria-hidden="true" />
            ) : validation.severity === "success" ? (
              <CheckCircle2 size={14} aria-hidden="true" />
            ) : (
              <Info size={14} aria-hidden="true" />
            )}
            <span>{validation.message}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
