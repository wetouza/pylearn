"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, ChevronDown, Lightbulb, Link2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { glossaryTerms, glossaryCategories, searchGlossary } from "@/data/glossary";
import type { GlossaryCategory } from "@shared/types";

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | "all">(
    "all"
  );
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const filteredTerms = useMemo(() => {
    let terms = glossaryTerms;

    if (searchQuery) {
      terms = searchGlossary(searchQuery);
    }

    if (selectedCategory !== "all") {
      terms = terms.filter((term) => term.category === selectedCategory);
    }

    return terms.sort((a, b) => a.term.localeCompare(b.term, "ru"));
  }, [searchQuery, selectedCategory]);

  const getCategoryInfo = (categoryId: GlossaryCategory) => {
    return glossaryCategories.find((c) => c.id === categoryId);
  };

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
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-muted-foreground">
                  {glossaryTerms.length} терминов с простыми объяснениями
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Глоссарий{" "}
                <span className="text-emerald-500">IT-терминов</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Простые объяснения сложных понятий. Каждый термин объясняется
                понятным языком с аналогиями из повседневной жизни.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Search and filters */}
        <section className="py-8 border-y border-white/10 bg-background/50 backdrop-blur-xl sticky top-16 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="w-full lg:w-96">
                <Input
                  placeholder="Поиск терминов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant={selectedCategory === "all" ? "glow" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  Все
                </Button>
                {glossaryCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "glow" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="gap-1"
                  >
                    <span>{category.icon}</span>
                    <span className="hidden sm:inline">{category.title}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Terms list */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Results count */}
              <div className="mb-6 text-sm text-muted-foreground">
                {filteredTerms.length === 0 ? (
                  "Ничего не найдено"
                ) : (
                  <>Найдено терминов: {filteredTerms.length}</>
                )}
              </div>

              {/* Terms */}
              <StaggerContainer className="space-y-3">
                <AnimatePresence>
                  {filteredTerms.map((term) => {
                    const category = getCategoryInfo(term.category);
                    const isExpanded = expandedTerm === term.id;

                    return (
                      <StaggerItem key={term.id}>
                        <motion.div layout>
                          <Card
                            variant="glow"
                            className="overflow-hidden"
                          >
                            {/* Term header */}
                            <button
                              onClick={() =>
                                setExpandedTerm(isExpanded ? null : term.id)
                              }
                              className="w-full p-5 flex items-center gap-4 text-left hover:bg-white/5 transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-semibold">
                                    {term.term}
                                  </h3>
                                  <Badge variant="glass" className="text-xs">
                                    {category?.icon} {category?.title}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {term.definition}
                                </p>
                              </div>
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                              </motion.div>
                            </button>

                            {/* Expanded content */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-5 pb-5 space-y-4 border-t border-white/10 pt-4">
                                    {/* Simple explanation */}
                                    <div>
                                      <h4 className="text-sm font-semibold text-emerald-500 mb-2">
                                        Простыми словами
                                      </h4>
                                      <p className="text-muted-foreground">
                                        {term.simpleExplanation}
                                      </p>
                                    </div>

                                    {/* Analogy */}
                                    {term.analogy && (
                                      <div className="p-4 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Lightbulb className="w-4 h-4 text-neon-cyan" />
                                          <span className="text-sm font-semibold text-neon-cyan">
                                            Аналогия
                                          </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                          {term.analogy}
                                        </p>
                                      </div>
                                    )}

                                    {/* Examples */}
                                    {term.examples && term.examples.length > 0 && (
                                      <div>
                                        <h4 className="text-sm font-semibold text-python-yellow mb-2">
                                          Примеры
                                        </h4>
                                        <pre className="code-block text-sm">
                                          {term.examples.join("\n")}
                                        </pre>
                                      </div>
                                    )}

                                    {/* Related terms */}
                                    {term.relatedTerms.length > 0 && (
                                      <div>
                                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                          <Link2 className="w-4 h-4" />
                                          Связанные термины
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                          {term.relatedTerms.map((related) => (
                                            <Badge
                                              key={related}
                                              variant="outline"
                                              className="cursor-pointer hover:bg-white/10"
                                              onClick={() => {
                                                setSearchQuery(related);
                                                setExpandedTerm(null);
                                              }}
                                            >
                                              {related}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </Card>
                        </motion.div>
                      </StaggerItem>
                    );
                  })}
                </AnimatePresence>
              </StaggerContainer>

              {/* Empty state */}
              {filteredTerms.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Термины не найдены
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Попробуй изменить поисковый запрос или выбрать другую категорию
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Alphabet navigation */}
        <section className="py-8 border-t border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 text-center">
                Алфавитный указатель
              </h3>
              
              {/* Cyrillic */}
              <div className="flex flex-wrap justify-center gap-1 mb-4">
                {"АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ".split("").map((letter) => {
                  const hasTerms = glossaryTerms.some((term) =>
                    term.term.toUpperCase().startsWith(letter)
                  );
                  return (
                    <button
                      key={letter}
                      onClick={() => {
                        if (hasTerms) {
                          setSearchQuery(letter);
                          setSelectedCategory("all");
                        }
                      }}
                      disabled={!hasTerms}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        hasTerms
                          ? "hover:bg-white/10 text-foreground"
                          : "text-muted-foreground/30 cursor-not-allowed"
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
              
              {/* Latin */}
              <div className="flex flex-wrap justify-center gap-1">
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
                  const hasTerms = glossaryTerms.some((term) =>
                    term.term.toUpperCase().startsWith(letter)
                  );
                  return (
                    <button
                      key={letter}
                      onClick={() => {
                        if (hasTerms) {
                          setSearchQuery(letter);
                          setSelectedCategory("all");
                        }
                      }}
                      disabled={!hasTerms}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        hasTerms
                          ? "hover:bg-white/10 text-foreground"
                          : "text-muted-foreground/30 cursor-not-allowed"
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

