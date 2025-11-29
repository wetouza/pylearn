"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Code,
  Keyboard,
  Users,
  Dumbbell,
  BookMarked,
  Zap,
  ArrowRight,
  Target,
  X,
} from "lucide-react";
import { guides } from "@/data/guides";
import { glossaryTerms } from "@/data/glossary";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  category: string;
}

const staticPages: SearchResult[] = [
  {
    id: "home",
    title: "Главная",
    description: "Вернуться на главную страницу",
    href: "/",
    icon: <Zap className="w-4 h-4" />,
    category: "Страницы",
  },
  {
    id: "guides",
    title: "Гайды по Python",
    description: "Пошаговые уроки от основ до проектов",
    href: "/guides",
    icon: <BookOpen className="w-4 h-4" />,
    category: "Страницы",
  },
  {
    id: "vscode",
    title: "Настройка VS Code",
    description: "Установка и настройка редактора кода",
    href: "/vscode",
    icon: <Code className="w-4 h-4" />,
    category: "Страницы",
  },
  {
    id: "typing",
    title: "Тренажёр печати",
    description: "Развивай скорость слепой печати",
    href: "/typing",
    icon: <Keyboard className="w-4 h-4" />,
    category: "Страницы",
  },
  {
    id: "glossary",
    title: "Глоссарий",
    description: "IT-термины простым языком",
    href: "/glossary",
    icon: <BookMarked className="w-4 h-4" />,
    category: "Страницы",
  },
  {
    id: "trainers",
    title: "Тренажёры",
    description: "Платформы для практики кода",
    href: "/trainers",
    icon: <Dumbbell className="w-4 h-4" />,
    category: "Страницы",
  },
  {
    id: "community",
    title: "Сообщество",
    description: "Telegram, YouTube, Discord",
    href: "/community",
    icon: <Users className="w-4 h-4" />,
    category: "Страницы",
  },
  {
    id: "goals",
    title: "Мой прогресс",
    description: "Цели и достижения",
    href: "/goals",
    icon: <Target className="w-4 h-4" />,
    category: "Страницы",
  },
];

export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Build search results
  const results = useMemo(() => {
    if (!query.trim()) {
      return staticPages;
    }

    const lowerQuery = query.toLowerCase();
    const allResults: SearchResult[] = [];

    // Search static pages
    staticPages.forEach((page) => {
      if (
        page.title.toLowerCase().includes(lowerQuery) ||
        page.description.toLowerCase().includes(lowerQuery)
      ) {
        allResults.push(page);
      }
    });

    // Search guides
    guides.forEach((guide) => {
      if (
        guide.title.toLowerCase().includes(lowerQuery) ||
        guide.description.toLowerCase().includes(lowerQuery)
      ) {
        allResults.push({
          id: `guide-${guide.id}`,
          title: guide.title,
          description: guide.description,
          href: `/guides/${guide.slug}`,
          icon: <span className="text-base">{guide.icon}</span>,
          category: "Уроки",
        });
      }
    });

    // Search glossary
    glossaryTerms.forEach((term) => {
      if (
        term.term.toLowerCase().includes(lowerQuery) ||
        term.definition.toLowerCase().includes(lowerQuery)
      ) {
        allResults.push({
          id: `term-${term.id}`,
          title: term.term,
          description: term.simpleExplanation.slice(0, 60) + "...",
          href: `/glossary?search=${encodeURIComponent(term.term)}`,
          icon: <BookMarked className="w-4 h-4" />,
          category: "Глоссарий",
        });
      }
    });

    return allResults.slice(0, 12);
  }, [query]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Navigation within results
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }
      if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        router.push(results[selectedIndex].href);
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, router]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = useCallback(
    (href: string) => {
      router.push(href);
      setIsOpen(false);
    },
    [router]
  );

  // Group results by category
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    results.forEach((result) => {
      if (!groups[result.category]) {
        groups[result.category] = [];
      }
      groups[result.category].push(result);
    });
    return groups;
  }, [results]);

  // Flatten for index tracking
  const flatResults = results;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
        style={{
          background: "hsl(var(--muted))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Поиск</span>
        <kbd
          className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono ml-2"
          style={{ background: "hsl(var(--background))" }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)" }}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.15 }}
              className="fixed left-1/2 top-[15%] -translate-x-1/2 z-50 w-full max-w-xl px-4"
            >
              <div
                className="rounded-2xl shadow-2xl overflow-hidden"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Поиск по сайту..."
                    className="w-full pl-12 pr-12 py-4 bg-transparent outline-none text-base placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Divider */}
                <div className="h-px" style={{ background: "hsl(var(--border))" }} />

                {/* Results */}
                <div
                  ref={listRef}
                  className="max-h-[400px] overflow-y-auto overscroll-contain p-2"
                >
                  {results.length === 0 ? (
                    <div className="py-12 text-center">
                      <Search className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        Ничего не найдено по запросу &quot;{query}&quot;
                      </p>
                    </div>
                  ) : (
                    Object.entries(groupedResults).map(([category, items]) => (
                      <div key={category} className="mb-2 last:mb-0">
                        <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                          {category}
                        </div>
                        {items.map((result) => {
                          const globalIndex = flatResults.findIndex((r) => r.id === result.id);
                          const isSelected = globalIndex === selectedIndex;

                          return (
                            <button
                              key={result.id}
                              onClick={() => handleSelect(result.href)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
                              style={{
                                background: isSelected ? "hsl(var(--muted))" : "transparent",
                              }}
                            >
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: isSelected
                                    ? "hsl(var(--primary) / 0.15)"
                                    : "hsl(var(--muted))",
                                }}
                              >
                                {result.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {result.title}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {result.description}
                                </div>
                              </div>
                              {isSelected && (
                                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div
                  className="flex items-center justify-between px-4 py-2.5 text-xs text-muted-foreground border-t"
                  style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted) / 0.3)" }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 rounded font-mono text-[10px]" style={{ background: "hsl(var(--muted))" }}>↑</kbd>
                      <kbd className="px-1.5 py-0.5 rounded font-mono text-[10px]" style={{ background: "hsl(var(--muted))" }}>↓</kbd>
                      <span>навигация</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 rounded font-mono text-[10px]" style={{ background: "hsl(var(--muted))" }}>↵</kbd>
                      <span>открыть</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded font-mono text-[10px]" style={{ background: "hsl(var(--muted))" }}>esc</kbd>
                    <span>закрыть</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
