"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Star,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Dumbbell,
  Filter,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { trainers } from "@/data/trainers";
import type { TrainerDifficulty } from "@shared/types";

const difficultyLabels: Record<TrainerDifficulty, string> = {
  beginner: "Новичок",
  intermediate: "Средний",
  advanced: "Продвинутый",
};

const difficultyColors: Record<TrainerDifficulty, string> = {
  beginner: "badge-beginner",
  intermediate: "badge-basic",
  advanced: "badge-practice",
};

export default function TrainersPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    TrainerDifficulty | "all"
  >("all");
  const [expandedTrainer, setExpandedTrainer] = useState<string | null>(null);

  const filteredTrainers = trainers.filter(
    (trainer) =>
      selectedDifficulty === "all" ||
      trainer.difficulty.includes(selectedDifficulty)
  );

  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
          <div className="absolute inset-0 grid-pattern opacity-20" />

          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Dumbbell className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">
                  Практика — ключ к мастерству
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Тренажёры для{" "}
                <span className="text-orange-500">практики</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Подборка лучших платформ для отработки навыков программирования.
                Выбери подходящую по уровню и начни решать задачи!
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-y border-white/10 bg-background/50 backdrop-blur-xl sticky top-16 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-4">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Tabs
                value={selectedDifficulty}
                onValueChange={(v) =>
                  setSelectedDifficulty(v as TrainerDifficulty | "all")
                }
              >
                <TabsList>
                  <TabsTrigger value="all">Все</TabsTrigger>
                  <TabsTrigger value="beginner">Для новичков</TabsTrigger>
                  <TabsTrigger value="intermediate">Средний</TabsTrigger>
                  <TabsTrigger value="advanced">Продвинутый</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Recommendation for beginners */}
        {selectedDifficulty === "all" && (
          <section className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <Card variant="glow" className="p-6 bg-gradient-to-r from-neon-green/10 to-neon-cyan/10 border-neon-green/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neon-green/20 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-6 h-6 text-neon-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Рекомендация для новичков</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Если ты только начинаешь, рекомендуем такой путь:
                    </p>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>
                        <strong className="text-foreground">CodingBat</strong> — для первых шагов (1 неделя)
                      </li>
                      <li>
                        <strong className="text-foreground">Codewars</strong> — задачи 8-7 kyu (2-4 недели)
                      </li>
                      <li>
                        <strong className="text-foreground">HackerRank</strong> — получи сертификат Python
                      </li>
                      <li>
                        <strong className="text-foreground">Exercism</strong> — для код-ревью от менторов
                      </li>
                    </ol>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Trainers list */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTrainers.map((trainer) => (
                <StaggerItem key={trainer.id}>
                  <Card variant="glow" className="h-full overflow-hidden">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{trainer.logo}</span>
                          <div>
                            <h3 className="text-xl font-semibold">
                              {trainer.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-python-yellow fill-python-yellow" />
                                <span className="text-sm">{trainer.rating}</span>
                              </div>
                              {trainer.isPaid && (
                                <Badge variant="outline" className="text-xs">
                                  Премиум
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <a
                          href={trainer.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="glow" size="sm">
                            Открыть
                            <ExternalLink className="ml-2 w-4 h-4" />
                          </Button>
                        </a>
                      </div>

                      {/* Difficulty badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {trainer.difficulty.map((diff) => (
                          <Badge key={diff} className={difficultyColors[diff]}>
                            {difficultyLabels[diff]}
                          </Badge>
                        ))}
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground mb-4">
                        {trainer.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {trainer.features.map((feature) => (
                          <Badge key={feature} variant="glass" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      {/* Expandable details */}
                      <button
                        onClick={() =>
                          setExpandedTrainer(
                            expandedTrainer === trainer.id ? null : trainer.id
                          )
                        }
                        className="text-sm text-neon-cyan hover:underline"
                      >
                        {expandedTrainer === trainer.id
                          ? "Скрыть подробности"
                          : "Показать подробности"}
                      </button>

                      {expandedTrainer === trainer.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 space-y-4"
                        >
                          {/* Pros */}
                          <div>
                            <h4 className="text-sm font-semibold text-neon-green mb-2 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              Плюсы
                            </h4>
                            <ul className="space-y-1">
                              {trainer.pros.map((pro) => (
                                <li
                                  key={pro}
                                  className="text-sm text-muted-foreground flex items-start gap-2"
                                >
                                  <span className="text-neon-green">+</span>
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Cons */}
                          <div>
                            <h4 className="text-sm font-semibold text-red-500 mb-2 flex items-center gap-2">
                              <XCircle className="w-4 h-4" />
                              Минусы
                            </h4>
                            <ul className="space-y-1">
                              {trainer.cons.map((con) => (
                                <li
                                  key={con}
                                  className="text-sm text-muted-foreground flex items-start gap-2"
                                >
                                  <span className="text-red-500">-</span>
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Tips */}
                          <div className="p-4 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20">
                            <h4 className="text-sm font-semibold text-neon-cyan mb-2 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4" />
                              Советы для начинающих
                            </h4>
                            <ul className="space-y-1">
                              {trainer.tips.map((tip) => (
                                <li
                                  key={tip}
                                  className="text-sm text-muted-foreground"
                                >
                                  • {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card variant="glow" className="p-8 lg:p-12 text-center">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                Теория без практики бесполезна!
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Решай хотя бы по одной задаче в день. Через месяц ты удивишься,
                как много уже умеешь!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://www.codewars.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="glow" size="lg">
                    Начать на Codewars
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </a>
                <a href="/guides">
                  <Button variant="outline" size="lg">
                    Вернуться к гайдам
                  </Button>
                </a>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

