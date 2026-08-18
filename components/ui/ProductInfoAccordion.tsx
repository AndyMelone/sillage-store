"use client";

import { Plus } from "lucide-react";
import { useState, type ReactNode } from "react";

interface AccordionItemData {
  title: string;
  content: ReactNode;
}

function AccordionRow({ title, content }: AccordionItemData) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-border first:border-t-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-lg text-foreground"
      >
        <span>{title}</span>
        <Plus
          className={`h-4 w-4 shrink-0 text-accent transition-transform ${
            open ? "rotate-45" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden px-4 transition-all duration-300 ${
          open ? "max-h-96 pb-4 opacity-100" : "max-h-0 pb-0 opacity-0"
        }`}
      >
        <div className="text-base leading-relaxed text-muted-foreground">
          {content}
        </div>
      </div>
    </div>
  );
}

export function ProductInfoAccordion({ items }: { items: AccordionItemData[] }) {
  return (
    <div className="mt-2 border border-border bg-background">
      {items.map((item) => (
        <AccordionRow key={item.title} title={item.title} content={item.content} />
      ))}
    </div>
  );
}
