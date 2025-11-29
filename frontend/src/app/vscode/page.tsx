"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Monitor,
  Code,
  Puzzle,
  Settings,
  ChevronRight,
  ChevronDown,
  Lightbulb,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { vscodeSections } from "@/data/vscode";

const sectionIcons: Record<string, React.ElementType> = {
  installation: Download,
  interface: Monitor,
  "python-setup": Code,
  extensions: Puzzle,
  settings: Settings,
};

export default function VSCodePage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "installation"
  );
  const [expandedStep, setExpandedStep] = useState<string | null>("download");

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
    setExpandedStep(null);
  };

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    return content.split("\n").map((line, index) => {
      // Headers
      if (line.startsWith("## ")) {
        return (
          <h3 key={index} className="text-xl font-bold mt-6 mb-3 text-foreground">
            {line.replace("## ", "")}
          </h3>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h4 key={index} className="text-lg font-semibold mt-4 mb-2 text-foreground">
            {line.replace("### ", "")}
          </h4>
        );
      }

      // Code blocks
      if (line.startsWith("```")) {
        return null; // Handle code blocks separately
      }

      // Tips (> 💡)
      if (line.startsWith("> 💡")) {
        return (
          <div
            key={index}
            className="my-4 p-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-start gap-2"
          >
            <Lightbulb className="w-4 h-4 text-neon-cyan flex-shrink-0 mt-0.5" />
            <span className="text-sm text-muted-foreground">
              {line.replace("> 💡 ", "")}
            </span>
          </div>
        );
      }

      // Bold text
      if (line.includes("**")) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={index} className="my-2 text-muted-foreground">
            {parts.map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="text-foreground">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      }

      // List items
      if (line.startsWith("- ")) {
        return (
          <li key={index} className="ml-4 my-1 text-muted-foreground list-disc">
            {line.replace("- ", "")}
          </li>
        );
      }

      // Checkboxes
      if (line.includes("✅")) {
        return (
          <p key={index} className="my-1 text-neon-green">
            {line}
          </p>
        );
      }

      // Empty lines
      if (line.trim() === "") {
        return <br key={index} />;
      }

      // Regular text
      return (
        <p key={index} className="my-2 text-muted-foreground">
          {line}
        </p>
      );
    });
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
                <Code className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">
                  Пошаговое руководство
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Настройка{" "}
                <span className="text-blue-500">VS Code</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Visual Studio Code — лучший редактор кода для начинающих.
                Установи и настрой его за 15 минут с нашим руководством.
              </p>
              <a
                href="https://code.visualstudio.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="glow" size="lg">
                  Скачать VS Code
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </ScrollReveal>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-8 border-y border-white/10 bg-background/50 backdrop-blur-xl sticky top-16 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {vscodeSections.map((section) => {
                const Icon = sectionIcons[section.id] || Code;
                return (
                  <Button
                    key={section.id}
                    variant={expandedSection === section.id ? "glow" : "outline"}
                    size="sm"
                    onClick={() => toggleSection(section.id)}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {section.title}
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-4">
              {vscodeSections.map((section, sectionIndex) => {
                const Icon = sectionIcons[section.id] || Code;
                const isExpanded = expandedSection === section.id;

                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.1 }}
                  >
                    <Card variant="glow" className="overflow-hidden">
                      {/* Section header */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full p-6 flex items-center gap-4 text-left hover:bg-white/5 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground">
                              Раздел {sectionIndex + 1}
                            </span>
                            <Badge variant="glass" className="text-xs">
                              {section.steps.length} шагов
                            </Badge>
                          </div>
                          <h2 className="text-xl font-semibold">
                            {section.icon} {section.title}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {section.description}
                          </p>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        </motion.div>
                      </button>

                      {/* Section content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 space-y-3">
                              {section.steps.map((step, stepIndex) => {
                                const isStepExpanded = expandedStep === step.id;

                                return (
                                  <div
                                    key={step.id}
                                    className="border border-white/10 rounded-xl overflow-hidden"
                                  >
                                    {/* Step header */}
                                    <button
                                      onClick={() => toggleStep(step.id)}
                                      className="w-full p-4 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
                                    >
                                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                                        {stepIndex + 1}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold">
                                          {step.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                          {step.description}
                                        </p>
                                      </div>
                                      <motion.div
                                        animate={{
                                          rotate: isStepExpanded ? 90 : 0,
                                        }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                      </motion.div>
                                    </button>

                                    {/* Step content */}
                                    <AnimatePresence>
                                      {isStepExpanded && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: "auto", opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.3 }}
                                          className="overflow-hidden"
                                        >
                                          <div className="p-4 pt-0 border-t border-white/10">
                                            <div className="prose prose-invert max-w-none">
                                              {renderContent(step.content)}
                                            </div>

                                            {/* Tips */}
                                            {step.tips && step.tips.length > 0 && (
                                              <div className="mt-6 p-4 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20">
                                                <div className="flex items-center gap-2 mb-2">
                                                  <Lightbulb className="w-4 h-4 text-neon-cyan" />
                                                  <span className="font-semibold text-neon-cyan">
                                                    Советы
                                                  </span>
                                                </div>
                                                <ul className="space-y-1">
                                                  {step.tips.map((tip, i) => (
                                                    <li
                                                      key={i}
                                                      className="text-sm text-muted-foreground"
                                                    >
                                                      • {tip}
                                                    </li>
                                                  ))}
                                                </ul>
                                              </div>
                                            )}

                                            {/* Warnings */}
                                            {step.warnings &&
                                              step.warnings.length > 0 && (
                                                <div className="mt-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                                  <div className="flex items-center gap-2 mb-2">
                                                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                                                    <span className="font-semibold text-orange-500">
                                                      Важно
                                                    </span>
                                                  </div>
                                                  <ul className="space-y-1">
                                                    {step.warnings.map(
                                                      (warning, i) => (
                                                        <li
                                                          key={i}
                                                          className="text-sm text-muted-foreground"
                                                        >
                                                          • {warning}
                                                        </li>
                                                      )
                                                    )}
                                                  </ul>
                                                </div>
                                              )}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card variant="glow" className="p-8 lg:p-12 text-center">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                VS Code настроен? Время писать код!
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Теперь ты готов начать изучение Python. Переходи к гайдам и
                напиши свою первую программу!
              </p>
              <Button variant="glow" size="lg" asChild>
                <a href="/guides">
                  Перейти к гайдам
                  <ChevronRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

