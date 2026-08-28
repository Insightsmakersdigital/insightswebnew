"use client";

import { useState } from "react";

interface FaqEntry {
  question: string;
  answer: string;
}

interface Props {
  items: FaqEntry[];
}

export default function FaqAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-ledger">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div className={["faq-row", isOpen && "is-open"].filter(Boolean).join(" ")} key={item.question}>
            <button
              className="faq-row-summary"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span className="faq-row-question">{item.question}</span>
              <span className="faq-row-icon" aria-hidden="true">
                +
              </span>
            </button>
            <div className="faq-row-panel">
              <div className="faq-row-panel-inner">
                <p className="faq-row-answer">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
