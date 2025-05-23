"use client";
import { useState } from "react";

interface WhyChooseUsItem {
  title: string;
  description: string;
}

export default function WhyChooseUsAccordion({ items }: { items: WhyChooseUsItem[] }) {
  return (
    <div className="max-w-2xl mx-auto">
      {items.map((item, idx) => (
        <AccordionItem key={idx} title={item.title} description={item.description} />
      ))}
    </div>
  );
}

function AccordionItem({ title, description }: { title: string; description: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-4 border rounded-lg">
      <button
        className="w-full text-left px-4 py-3 font-semibold flex justify-between items-center"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="text-left">{title}</span>
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-gray-600 text-left">
          {description}
        </div>
      )}
    </div>
  );
} 