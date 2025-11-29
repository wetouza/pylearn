"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Code,
  Target,
  BookMarked,
  Dumbbell,
  ArrowRight,
  Sparkles,
  Keyboard,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/shared/motion";

const features = [
  {
    icon: BookOpen,
    title: "Гайды по Python",
    description: "Пошаговые уроки от основ до проектов. Простые объяснения для новичков.",
    href: "/guides",
  },
  {
    icon: Code,
    title: "Настройка VS Code",
    description: "Детальные инструкции по установке редактора. Каждый шаг с картинками.",
    href: "/vscode",
  },
  {
    icon: Keyboard,
    title: "Слепая печать",
    description: "Тренажёр для развития скорости печати. Незаменимый навык программиста.",
    href: "/typing",
  },
  {
    icon: BookMarked,
    title: "Глоссарий терминов",
    description: "Простые объяснения IT-терминов с аналогиями из жизни.",
    href: "/glossary",
  },
  {
    icon: Dumbbell,
    title: "Тренажеры",
    description: "Подборка лучших платформ для практики кода с рекомендациями.",
    href: "/trainers",
  },
];

export function FeaturesSection() {
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
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: "hsl(var(--primary))" }} />
            <span className="text-xs sm:text-sm text-muted-foreground">
              Всё для успешного старта
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4 px-4">
            Что тебя ждёт на{" "}
            <span className="gradient-text">PyLearn</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl mx-auto px-4">
            Все инструменты для комфортного погружения в программирование
          </p>
        </ScrollReveal>

        {/* Features grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <Link href={feature.href} className="block h-full">
                <div className="glass-card-hover h-full p-6 group cursor-pointer flex flex-col" style={{ minHeight: "220px" }}>
                  {/* Icon */}
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, hsl(var(--gradient-start)), hsl(var(--gradient-end)))" }}
                  >
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                    {feature.description}
                  </p>

                  {/* Link */}
                  <div 
                    className="flex items-center text-sm font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "hsl(var(--primary))" }}
                  >
                    Перейти
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}

          {/* CTA Card */}
          <StaggerItem>
            <div 
              className="glass-card h-full p-6 flex flex-col justify-center items-center text-center"
              style={{ 
                background: "linear-gradient(135deg, hsl(var(--gradient-start) / 0.1), hsl(var(--gradient-end) / 0.1))",
                borderColor: "hsl(var(--primary) / 0.2)",
                minHeight: "220px"
              }}
            >
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg, hsl(var(--gradient-start)), hsl(var(--gradient-end)))" }}
              >
                <ArrowRight className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Готов начать?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Присоединяйся к тысячам новичков
              </p>
              <Link href="/guides">
                <Button variant="glow" size="default" className="btn-shimmer">
                  Начать обучение
                </Button>
              </Link>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
