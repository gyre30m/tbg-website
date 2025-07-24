"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title?: string;
  description?: string;
  faqs: FaqItem[];
  className?: string;
}

export function FaqSection({
  title = "Frequently Asked Questions",
  description,
  faqs,
  className,
}: FaqSectionProps) {
  return (
    <div className={`container px-4 md:px-6 ${className || ""}`}>
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
          FAQ
        </div>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="mx-auto mt-8 max-w-3xl md:mt-12">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b py-4"
            >
              <AccordionTrigger className="flex w-full items-center justify-between text-left text-lg font-medium transition-all hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pt-2 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
