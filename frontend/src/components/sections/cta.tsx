"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/shared/motion";

export function CTASection() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-pattern opacity-20" />

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-64 sm:w-[400px] h-64 sm:h-[400px] rounded-full blur-[100px]"
        style={{ background: "hsl(var(--gradient-start) / 0.1)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-64 sm:w-[400px] h-64 sm:h-[400px] rounded-full blur-[100px]"
        style={{ background: "hsl(var(--gradient-end) / 0.1)" }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            {/* Icon */}
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8"
              style={{ background: "linear-gradient(135deg, hsl(var(--gradient-start)), hsl(var(--gradient-end)))" }}
              whileHover={{ scale: 1.1, rotate: 10 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
            >
              <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
            </motion.div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6 px-4">
              Готов начать своё путешествие
              <br />
              <span className="gradient-text">в мир программирования?</span>
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8 sm:mb-10 px-4">
              Первый урок займёт всего 10 минут, и ты уже напишешь свою первую программу!
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
              <Link href="/guides" className="w-full sm:w-auto">
                <Button variant="glow" size="lg" className="w-full sm:w-auto group btn-shimmer">
                  Начать бесплатно
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/guides/what-is-python" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Что такое Python?
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <motion.div
              className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ background: "hsl(145 60% 45%)" }} />
                Без регистрации
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ background: "hsl(var(--primary))" }} />
                100% бесплатно
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ background: "hsl(var(--accent))" }} />
                На русском языке
              </div>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
