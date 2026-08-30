import { useState, useId } from "react";
import { Search, BookMarked, HelpCircle } from "lucide-react";
import { glossaryTerms } from "../data/glossary";

export function BeginnerGlossary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const searchInputId = useId();

  const categories = [
    { id: "all", label: "အားလုံး" },
    { id: "basics", label: "အခြေခံ သဘောတရား" },
    { id: "budgeting", label: "Budget & အသုံးစရိတ်" },
    { id: "business", label: "လုပ်ငန်း & Cash Flow" },
    { id: "debt", label: "အကြွေး & အတိုး" },
  ];

  const filteredTerms = glossaryTerms.filter((term) => {
    const matchesCat = selectedCategory === "all" || term.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      q === "" ||
      term.term.toLowerCase().includes(q) ||
      term.myanmarTerm.toLowerCase().includes(q) ||
      term.simpleExplanation.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <section className="glossary-section" id="glossary" aria-labelledby="glossary-title">
      <div className="glossary-intro">
        <p className="eyebrow">
          <BookMarked size={16} aria-hidden="true" /> BEGINNER FINANCE GLOSSARY
        </p>
        <h2 id="glossary-title">အသုံးများသော Finance စကားလုံးများ</h2>
        <p>
          ခက်ခဲသော အင်္ဂလိပ်စာလုံးများကို မြန်မာလို ရိုးရှင်းစွာ ရှင်းပြထားသော အဘိဓာန်တို။
        </p>
      </div>

      <div className="glossary-controls">
        <div className="glossary-search">
          <label htmlFor={searchInputId} className="sr-only">
            စကားလုံး ရှာဖွေရန်
          </label>
          <Search size={18} aria-hidden="true" className="search-icon" />
          <input
            id={searchInputId}
            type="text"
            placeholder="စကားလုံး ရှာဖွေရန် (ဥပမာ - Cash Flow, Emergency Fund...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery("")}
              aria-label="ရှာဖွေမှု ရှင်းထုတ်မည်"
            >
              ×
            </button>
          )}
        </div>

        <div className="glossary-filter-pills" role="tablist" aria-label="အမျိုးအစားအလိုက် စစ်ထုတ်ရန်">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat.id}
              className={`filter-pill ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="glossary-grid" role="list" aria-label="Finance စကားလုံးများ စာရင်း">
        {filteredTerms.length === 0 ? (
          <div className="glossary-empty">
            <HelpCircle size={32} aria-hidden="true" />
            <p>သင်ရှာဖွေသော စကားလုံးနှင့် ကိုက်ညီသည့် အချက်အလက် မတွေ့ရှိပါ။</p>
          </div>
        ) : (
          filteredTerms.map((term) => (
            <article className="glossary-card" key={term.id} role="listitem">
              <div className="glossary-card-header">
                <h3>{term.term}</h3>
                <span className="myanmar-sub">{term.myanmarTerm}</span>
              </div>
              <p className="glossary-def">{term.simpleExplanation}</p>
              <div className="glossary-example-box">
                <span className="example-tag">လက်တွေ့ ဥပမာ</span>
                <p>{term.example}</p>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
