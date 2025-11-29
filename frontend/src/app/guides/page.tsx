"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  ChevronRight,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { guides, guideCategories } from "@/data/guides";
import { formatDuration, getDifficultyLabel } from "@/lib/utils";
import type { LessonDifficulty } from "@shared/types";

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<LessonDifficulty | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");

  const filteredGuides = guides.filter((guide) => {
    const matchesSearch =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === "all" || guide.difficulty === selectedDifficulty;
    const matchesCategory =
      selectedCategory === "all" || guide.category === selectedCategory;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const difficultyVariant = (difficulty: LessonDifficulty) => {
    const variants: Record<LessonDifficulty, "beginner" | "basic" | "practice"> = {
      beginner: "beginner",
      basic: "basic",
      practice: "practice",
    };
    return variants[difficulty];
  };

  return (
    <>
      <Header />
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Hero */}
        <section className="relative py-10 sm:py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-20" />

          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="max-w-3xl mx-auto text-center">
              <div 
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border mb-4 sm:mb-6"
                style={{ background: "hsl(var(--card) / 0.5)", borderColor: "hsl(var(--border))" }}
              >
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: "hsl(var(--primary))" }} />
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {guides.length} уроков для новичков
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                Гайды по <span className="gradient-text">Python</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground px-4">
                Пошаговые уроки от основ до практических проектов
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Filters */}
        <section 
          className="py-4 sm:py-6 border-y sticky top-14 sm:top-16 z-40"
          style={{ background: "hsl(var(--background) / 0.8)", backdropFilter: "blur(12px)", borderColor: "hsl(var(--border))" }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
              {/* Search */}
              <div className="w-full sm:w-72 lg:w-96">
                <Input
                  placeholder="Поиск уроков..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </div>

              {/* Difficulty filter */}
              <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "hsl(var(--muted))" }}>
                {(["all", "beginner", "basic", "practice"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(d)}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all"
                    style={{
                      background: selectedDifficulty === d ? "hsl(var(--background))" : "transparent",
                      color: selectedDifficulty === d ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                      boxShadow: selectedDifficulty === d ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                    }}
                  >
                    {d === "all" ? "Все" : d === "beginner" ? "Новичок" : d === "basic" ? "Базовый" : "Практика"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">Категории</h2>
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {guideCategories.map((category) => (
                <StaggerItem key={category.id}>
                  <motion.button
                    onClick={() => setSelectedCategory(selectedCategory === category.id ? "all" : category.id)}
                    className="w-full h-full p-4 rounded-xl border transition-all text-left flex flex-col"
                    style={{
                      background: selectedCategory === category.id ? "hsl(var(--primary) / 0.1)" : "hsl(var(--card) / 0.5)",
                      borderColor: selectedCategory === category.id ? "hsl(var(--primary) / 0.3)" : "hsl(var(--border))",
                      minHeight: "140px"
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl mb-2 block">{category.icon}</span>
                    <h3 className="font-semibold text-sm mb-1 leading-tight">{category.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-auto">
                      {category.description}
                    </p>
                  </motion.button>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Guides list */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl font-bold">
                {selectedCategory === "all"
                  ? "Все уроки"
                  : guideCategories.find((c) => c.id === selectedCategory)?.title}
              </h2>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {filteredGuides.length} уроков
              </span>
            </div>

            {filteredGuides.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Уроки не найдены. Попробуйте изменить фильтры.
                </p>
              </div>
            ) : (
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredGuides.map((guide) => (
                  <StaggerItem key={guide.id}>
                    <Link href={`/guides/${guide.slug}`}>
                      <div className="glass-card-hover h-full p-4 sm:p-6 group">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <span className="text-2xl sm:text-3xl">{guide.icon}</span>
                          <Badge variant={difficultyVariant(guide.difficulty)}>
                            {getDifficultyLabel(guide.difficulty)}
                          </Badge>
                        </div>

                        {/* Content */}
                        <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2 group-hover:text-primary transition-colors">
                          {guide.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                          {guide.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            {formatDuration(guide.duration)}
                          </div>
                          <div 
                            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: "hsl(var(--primary))" }}
                          >
                            Читать
                            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div 
              className="glass-card p-6 sm:p-8 lg:p-12 text-center rounded-2xl"
              style={{ background: "linear-gradient(135deg, hsl(var(--gradient-start) / 0.1), hsl(var(--gradient-end) / 0.1))" }}
            >
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4" style={{ color: "hsl(var(--primary))" }} />
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                Готов начать обучение?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-xl mx-auto">
                Начни с первого урока — это займёт всего 10 минут!
              </p>
              <Link href="/guides/what-is-python">
                <Button variant="glow" size="lg" className="btn-shimmer">
                  Начать с основ
                  <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
