"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, BookOpen, Code, Trophy } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/shared/motion";

const steps = [
  {
    number: "01",
    icon: BookOpen,
    title: "Изучай теорию",
    description: "Читай понятные гайды с примерами. Каждый урок объясняет одну концепцию.",
  },
  {
    number: "02",
    icon: Code,
    title: "Практикуйся",
    description: "Закрепляй знания на тренажерах. Начни с простых задач.",
  },
  {
    number: "03",
    icon: Trophy,
    title: "Достигай целей",
    description: "Отслеживай прогресс и получай достижения.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full blur-[100px]" 
          style={{ background: "hsl(var(--primary) / 0.05)" }}
        />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4 px-4">
            Как это{" "}
            <span className="gradient-text">работает</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl mx-auto px-4">
            Три простых шага к освоению Python
          </p>
        </ScrollReveal>

        {/* Steps - horizontal on desktop, vertical on mobile */}
        <div className="max-w-4xl mx-auto">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step) => (
              <StaggerItem key={step.number}>
                <motion.div
                  className="text-center"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Icon in rounded square */}
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6"
                    style={{ 
                      background: "hsl(var(--muted))",
                      border: "1px solid hsl(var(--border))"
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, hsl(var(--gradient-start)), hsl(var(--gradient-end)))" }}
                    >
                      <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-xs sm:text-sm font-mono" style={{ color: "hsl(var(--primary))" }}>
                      {step.number}
                    </span>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Progress example */}
        <ScrollReveal delay={0.3} className="mt-12 sm:mt-16 lg:mt-20">
          <div className="max-w-2xl mx-auto glass-card p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl">
            <h4 className="text-sm sm:text-base lg:text-lg font-semibold mb-4 sm:mb-6 text-center">
              Пример твоего прогресса
            </h4>
            <div className="space-y-3 sm:space-y-4">
              {[
                { label: "Основы Python", progress: 100, completed: true },
                { label: "Переменные", progress: 100, completed: true },
                { label: "Условия и циклы", progress: 60, completed: false },
                { label: "Функции", progress: 0, completed: false },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="flex items-center gap-3 sm:gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: "hsl(145 60% 45%)" }} />
                  ) : (
                    <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs sm:text-sm truncate">{item.label}</span>
                      <span className="text-xs sm:text-sm text-muted-foreground ml-2">
                        {item.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 sm:h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(to right, hsl(var(--gradient-start)), hsl(var(--gradient-end)))" }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
