"use client";

import { HelpCircle } from "lucide-react";
import { FAQ, pythonFAQ } from "@/components/shared/faq";
import { ScrollReveal } from "@/components/shared/motion";

export function FAQSection() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-32 overflow-hidden">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-10 sm:mb-16">
          <div 
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border mb-4 sm:mb-6"
            style={{ 
              background: "hsl(var(--card) / 0.5)",
              borderColor: "hsl(var(--border))"
            }}
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: "hsl(var(--primary))" }} />
            <span className="text-xs sm:text-sm text-muted-foreground">
              Ответы на вопросы
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4 px-4">
            Частые{" "}
            <span className="gradient-text">вопросы</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl mx-auto px-4">
            Всё, что нужно знать перед началом обучения
          </p>
        </ScrollReveal>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <FAQ items={pythonFAQ} title="" />
        </div>
      </div>
    </section>
  );
}
