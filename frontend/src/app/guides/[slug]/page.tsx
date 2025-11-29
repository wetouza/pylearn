"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  Code,
  CheckCircle2,
  Copy,
  Check,
  Youtube,
  ExternalLink,
  Trophy,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal, FadeInUp } from "@/components/shared/motion";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ReadingProgress } from "@/components/shared/reading-progress";
import { Quiz } from "@/components/shared/quiz";
import { ShareButtons } from "@/components/shared/share-buttons";
import { guides, getGuideBySlug } from "@/data/guides";
import { getQuizBySlug, hasQuiz } from "@/data/quizzes";
import { useProgress } from "@/hooks/useProgress";
import { useAchievementNotification } from "@/hooks/useAchievementNotification";
import { formatDuration, getDifficultyLabel } from "@/lib/utils";
import type { GuideContent } from "@/data/guides";

function CodeBlock({
  content,
  output,
}: {
  content: string;
  output?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 sm:my-6">
      <div className="relative">
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 sm:h-8 px-2"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: "hsl(145 60% 45%)" }} />
            ) : (
              <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </Button>
        </div>
        <pre 
          className="p-3 sm:p-4 rounded-xl overflow-x-auto text-xs sm:text-sm"
          style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}
        >
          <code>{content}</code>
        </pre>
      </div>
      {output && (
        <div 
          className="mt-2 p-3 sm:p-4 rounded-xl"
          style={{ background: "hsl(var(--muted) / 0.5)", border: "1px solid hsl(var(--border) / 0.5)" }}
        >
          <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2">Вывод:</div>
          <pre 
            className="text-xs sm:text-sm font-mono whitespace-pre-wrap"
            style={{ color: "hsl(145 60% 45%)" }}
          >
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

function ContentBlock({ block }: { block: GuideContent }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="text-xl sm:text-2xl font-bold mt-8 sm:mt-10 mb-3 sm:mb-4 first:mt-0">
          {block.content}
        </h2>
      );
    case "text":
      return (
        <div
          className="text-sm sm:text-base text-muted-foreground leading-relaxed my-3 sm:my-4"
          dangerouslySetInnerHTML={{
            __html: block.content
              .replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>")
              .replace(/\n/g, "<br />"),
          }}
        />
      );
    case "code":
      return <CodeBlock content={block.content} output={block.output} />;
    case "tip":
      return (
        <div 
          className="my-4 sm:my-6 p-3 sm:p-4 rounded-xl"
          style={{ background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.2)" }}
        >
          <div className="flex items-start gap-2 sm:gap-3">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" style={{ color: "hsl(var(--primary))" }} />
            <div>
              <div className="font-semibold text-sm sm:text-base mb-1" style={{ color: "hsl(var(--primary))" }}>Совет</div>
              <p className="text-xs sm:text-sm text-muted-foreground">{block.content}</p>
            </div>
          </div>
        </div>
      );
    case "warning":
      return (
        <div 
          className="my-4 sm:my-6 p-3 sm:p-4 rounded-xl"
          style={{ background: "hsl(30 80% 50% / 0.1)", border: "1px solid hsl(30 80% 50% / 0.2)" }}
        >
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" style={{ color: "hsl(30 80% 50%)" }} />
            <div>
              <div className="font-semibold text-sm sm:text-base mb-1" style={{ color: "hsl(30 80% 50%)" }}>Внимание</div>
              <p className="text-xs sm:text-sm text-muted-foreground">{block.content}</p>
            </div>
          </div>
        </div>
      );
    case "exercise":
      return (
        <div 
          className="my-4 sm:my-6 p-3 sm:p-4 rounded-xl"
          style={{ background: "hsl(var(--accent) / 0.1)", border: "1px solid hsl(var(--accent) / 0.2)" }}
        >
          <div className="flex items-start gap-2 sm:gap-3">
            <Code className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" style={{ color: "hsl(var(--accent))" }} />
            <div>
              <div className="font-semibold text-sm sm:text-base mb-1" style={{ color: "hsl(var(--accent))" }}>Упражнение</div>
              <p className="text-xs sm:text-sm text-muted-foreground">{block.content}</p>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function GuidePage() {
  const params = useParams();
  const slug = params.slug as string;
  const guide = getGuideBySlug(slug);
  const quiz = getQuizBySlug(slug);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const { completeGuide, saveQuizResult, isGuideCompleted, updateStreak } = useProgress();
  
  // Enable achievement notifications
  useAchievementNotification();
  
  // Check if already completed
  useEffect(() => {
    if (guide) {
      setIsCompleted(isGuideCompleted(guide.id));
      updateStreak();
    }
  }, [guide, isGuideCompleted, updateStreak]);

  const handleComplete = () => {
    if (guide && !isCompleted) {
      completeGuide(guide.id);
      setIsCompleted(true);
    }
  };

  const handleQuizComplete = (score: number) => {
    if (guide) {
      saveQuizResult(guide.id, score);
      if (score >= 70) {
        handleComplete();
      }
    }
  };

  if (!guide) {
    return (
      <>
        <Header />
        <main className="flex-1 pt-20 min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl font-bold mb-4">Урок не найден</h1>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">
              К сожалению, такого урока не существует.
            </p>
            <Link href="/guides">
              <Button variant="glow">Вернуться к урокам</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const currentIndex = guides.findIndex((g) => g.slug === slug);
  const prevGuide = currentIndex > 0 ? guides[currentIndex - 1] : null;
  const nextGuide = currentIndex < guides.length - 1 ? guides[currentIndex + 1] : null;
  const progress = Math.round(((currentIndex + 1) / guides.length) * 100);

  const difficultyVariant = {
    beginner: "beginner" as const,
    basic: "basic" as const,
    practice: "practice" as const,
  };

  return (
    <>
      <Header />
      <ReadingProgress />
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Hero */}
        <section className="relative py-8 sm:py-12 lg:py-16 overflow-hidden border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInUp>
              {/* Breadcrumbs */}
              <Breadcrumbs
                items={[
                  { label: "Гайды", href: "/guides" },
                  { label: guide.title },
                ]}
              />

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <span className="text-2xl sm:text-4xl">{guide.icon}</span>
                    <Badge variant={difficultyVariant[guide.difficulty]}>
                      {getDifficultyLabel(guide.difficulty)}
                    </Badge>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
                    {guide.title}
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl">
                    {guide.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {formatDuration(guide.duration)}
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Урок {currentIndex + 1}/{guides.length}
                  </div>
                  <ShareButtons title={`${guide.title} — PyLearn`} />
                </div>
              </div>

              {/* YouTube link */}
              {guide.youtubeUrl && (
                <div className="mt-4 sm:mt-6">
                  <a
                    href={guide.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all hover:scale-[1.02]"
                    style={{ 
                      background: "hsl(0 70% 50% / 0.1)", 
                      border: "1px solid hsl(0 70% 50% / 0.2)",
                      color: "hsl(0 70% 55%)"
                    }}
                  >
                    <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
                    Смотреть видео на YouTube
                    <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </a>
                </div>
              )}
            </FadeInUp>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <ScrollReveal>
                <div 
                  className="glass-card p-4 sm:p-6 lg:p-10"
                >
                  {guide.content.map((block, index) => (
                    <ContentBlock key={index} block={block} />
                  ))}

                  {/* Quiz section */}
                  {quiz && (
                    <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Trophy className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "hsl(var(--primary))" }} />
                          <span className="font-semibold text-sm sm:text-base">Проверь себя</span>
                        </div>
                        {!showQuiz && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowQuiz(true)}
                          >
                            Пройти квиз
                          </Button>
                        )}
                      </div>
                      
                      {showQuiz && (
                        <Quiz questions={quiz} onComplete={handleQuizComplete} />
                      )}
                    </div>
                  )}

                  {/* Completion */}
                  <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 sm:gap-3" style={{ color: isCompleted ? "hsl(145 60% 45%)" : "hsl(var(--muted-foreground))" }}>
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="font-semibold text-sm sm:text-base">
                          {isCompleted ? "Урок завершён!" : "Завершить урок"}
                        </span>
                      </div>
                      {!isCompleted && !quiz && (
                        <Button
                          variant="glow"
                          size="sm"
                          onClick={handleComplete}
                        >
                          Отметить как пройденный
                        </Button>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                      {isCompleted 
                        ? "Отличная работа! Переходи к следующему уроку."
                        : quiz 
                          ? "Пройди квиз выше, чтобы завершить урок."
                          : "Нажми кнопку, когда закончишь изучение материала."
                      }
                    </p>

                    {/* Navigation */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      {prevGuide && (
                        <Link href={`/guides/${prevGuide.slug}`} className="flex-1">
                          <Button variant="outline" className="w-full justify-start text-xs sm:text-sm">
                            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                            <span className="truncate">{prevGuide.title}</span>
                          </Button>
                        </Link>
                      )}
                      {nextGuide && (
                        <Link href={`/guides/${nextGuide.slug}`} className="flex-1">
                          <Button variant="glow" className="w-full justify-end text-xs sm:text-sm btn-shimmer">
                            <span className="truncate">{nextGuide.title}</span>
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
