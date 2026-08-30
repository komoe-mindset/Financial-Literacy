import { useState } from "react";
import {
  Presentation,
  Printer,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  BookOpen,
  MessageSquare,
  Sparkles,
  Award,
} from "lucide-react";
import { curriculumPlans } from "../data/lessonPlan";
import type { CurriculumMode } from "../types";

export function EducatorToolkit() {
  const [activeCurriculum, setActiveCurriculum] = useState<CurriculumMode>("60min");
  const [showAllAnswers, setShowAllAnswers] = useState(true);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const currentPlan = curriculumPlans[activeCurriculum];

  const handlePrint = () => {
    window.print();
  };

  const toggleRow = (index: number) => {
    setExpandedRow((prev) => (prev === index ? null : index));
  };

  return (
    <section className="teacher-section" id="teach" aria-labelledby="teacher-title">
      <div className="teacher-intro">
        <p className="eyebrow">
          <Presentation size={16} aria-hidden="true" /> EDUCATOR & TRAINER TOOLKIT
        </p>
        <h2 id="teacher-title">
          ဆရာ/ဆရာမနှင့် သင်ကြားသူအတွက်
          <br />
          အသင့်သုံး သင်ရိုးညွှန်းတမ်းများ
        </h2>
        <p>
          Lecture သက်သက်မဟုတ်ဘဲ အပြန်အလှန် မေးခွန်း၊ လက်တွေ့တွက်ချက်မှုနှင့် ဆွေးနွေးမှုများ ပေါင်းစပ်ထားသော
          အသင့်သုံး Class Flow များ။
        </p>

        {/* Action Controls for Educators */}
        <div className="educator-header-actions">
          <button
            type="button"
            className="print-btn"
            onClick={handlePrint}
            aria-label="သင်ကြားရေး စာရွက်ကို ပရင့်ထုတ်မည် သို့မဟုတ် PDF အဖြစ် သိမ်းမည်"
          >
            <Printer size={16} aria-hidden="true" />
            <span>Worksheet ပရင့်ထုတ်မည် (Print/PDF)</span>
          </button>

          <button
            type="button"
            className="toggle-answers-btn"
            onClick={() => setShowAllAnswers((prev) => !prev)}
            aria-label="အဖြေလမ်းညွှန်များကို ဝှက်မည်/ဖော်မည်"
          >
            {showAllAnswers ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
            <span>{showAllAnswers ? "အဖြေလမ်းညွှန် ဝှက်မည်" : "အဖြေလမ်းညွှန် ဖော်မည်"}</span>
          </button>
        </div>
      </div>

      {/* Curriculum Duration Tabs */}
      <div className="curriculum-mode-tabs" role="tablist" aria-label="သင်ရိုးကြာချိန် ရွေးချယ်ရန်">
        {(["30min", "60min", "3hour"] as CurriculumMode[]).map((mode) => {
          const isSelected = activeCurriculum === mode;
          const plan = curriculumPlans[mode];
          return (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`curriculum-tab-btn ${isSelected ? "active" : ""}`}
              onClick={() => {
                setActiveCurriculum(mode);
                setExpandedRow(null);
              }}
            >
              <strong>{plan.durationLabel}</strong>
              <small>{mode === "30min" ? "အမြန်သုံး" : mode === "60min" ? "စံပြအတန်း" : "အလုပ်ရုံဆွေးနွေးပွဲ"}</small>
            </button>
          );
        })}
      </div>

      {/* Current Plan Overview Card */}
      <div className="curriculum-overview-card">
        <div className="plan-meta">
          <h3>{currentPlan.title}</h3>
          <span className="audience-badge">ပရိသတ် - {currentPlan.targetAudience}</span>
        </div>
        <p>{currentPlan.description}</p>
      </div>

      {/* Detailed Lesson Rows */}
      <div className="detailed-lesson-list" role="list" aria-label="အဆင့်လိုက် သင်ကြားရေး အစီအစဉ်">
        {currentPlan.items.map((item, index) => {
          const isExpanded = expandedRow === index;
          return (
            <article className={`detailed-lesson-card ${isExpanded ? "expanded" : ""}`} key={index} role="listitem">
              <div
                className="lesson-card-summary"
                onClick={() => toggleRow(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    toggleRow(index);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-expanded={isExpanded}
              >
                <div className="time-badge">
                  <span>{item.time}</span>
                  <small>မိနစ်</small>
                </div>
                <div className="title-area">
                  <span className="step-tag">အပိုင်း {index + 1}</span>
                  <h4>{item.title}</h4>
                </div>
                <button
                  type="button"
                  className="expand-indicator"
                  aria-label={isExpanded ? "အသေးစိတ် ခေါက်သိမ်းမည်" : "အသေးစိတ် ဖွင့်ကြည့်မည်"}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRow(index);
                  }}
                >
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              {/* Collapsible / Detailed Content */}
              <div className="lesson-card-details">
                {/* 1. Learning Objective */}
                <div className="detail-block">
                  <div className="block-label">
                    <BookOpen size={16} aria-hidden="true" />
                    <strong>သင်ကြားမှု ရည်ရွယ်ချက် (Learning Objective)</strong>
                  </div>
                  <p>{item.learningObjective}</p>
                </div>

                {/* 2. Teacher Wording */}
                <div className="detail-block teacher-quote">
                  <div className="block-label">
                    <MessageSquare size={16} aria-hidden="true" />
                    <strong>ဆရာ/ဆရာမ ပြောကြားရန် နမူနာ (Teacher Wording)</strong>
                  </div>
                  <p className="quote-text">{item.teacherWording}</p>
                </div>

                {/* 3. Student Activity */}
                <div className="detail-block">
                  <div className="block-label">
                    <Sparkles size={16} aria-hidden="true" />
                    <strong>ကျောင်းသား လှုပ်ရှားမှု (Student Activity)</strong>
                  </div>
                  <p>{item.studentActivity}</p>
                </div>

                {/* 4. Discussion Question & Answer Guidance */}
                <div className="detail-block discussion-block">
                  <div className="block-label">
                    <strong>ဆွေးနွေးရန် မေးခွန်း (Discussion Question)</strong>
                  </div>
                  <p className="question-text">❓ “{item.discussionQuestion}”</p>

                  {showAllAnswers && (
                    <div className="answer-guidance-box">
                      <span className="guidance-tag">ဆရာ/ဆရာမ အဖြေလမ်းညွှန်</span>
                      <p>{item.answerGuidance}</p>
                    </div>
                  )}
                </div>

                {/* 5. Reflection & Action */}
                <div className="detail-grid-two">
                  <div className="mini-detail-card">
                    <strong>ပြန်လည်ဆန်းစစ်မှု (Reflection)</strong>
                    <p>{item.reflection}</p>
                  </div>
                  <div className="mini-detail-card">
                    <strong>30-Day Action Assignment</strong>
                    <p>{item.actionItem}</p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Classroom Worksheet Print Footer */}
      <div className="worksheet-print-footer">
        <Award size={24} aria-hidden="true" />
        <div>
          <h4>သင်ကြားရေး စာရွက်များ ရယူရန်</h4>
          <p>
            ကျောင်းသားများအား ဝေငှရန်အတွက် ဤသင်ရိုးညွှန်းတမ်းအား A4 စာရွက်ဖြင့် Print ထုတ်၍ အသုံးပြုနိုင်ပါသည်။
          </p>
        </div>
        <button type="button" className="print-btn-secondary" onClick={handlePrint}>
          <Printer size={16} aria-hidden="true" />
          <span>ပရင့်ထုတ်မည်</span>
        </button>
      </div>
    </section>
  );
}
