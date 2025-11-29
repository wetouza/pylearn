"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
  Command,
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
];

export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Build search results
  const results = useMemo(() => {
    if (!query.trim()) {
      return staticPages.slice(0, 6);
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
          icon: <span className="text-sm">{guide.icon}</span>,
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
          description: term.definition.slice(0, 80) + "...",
          href: `/glossary?search=${encodeURIComponent(term.term)}`,
          icon: <BookMarked className="w-4 h-4" />,
          category: "Глоссарий",
        });
      }
    });

    return allResults.slice(0, 10);
  }, [query]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }

      // Close with Escape
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Navigation within results
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      }
      if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        router.push(results[selectedIndex].href);
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, router]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = useCallback(
    (href: string) => {
      router.push(href);
      setIsOpen(false);
      setQuery("");
    },
    [router]
  );

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
        style={{
          background: "hsl(var(--muted))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <Search className="w-4 h-4" />
        <span>Поиск...</span>
        <kbd
          className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono"
          style={{ background: "hsl(var(--background))" }}
        >
          <Command className="w-3 h-3" />K
        </kbd>
      </button>

      {/* Mobile trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="sm:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
      >
        <Search className="w-5 h-5" />
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
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-[20%] -translate-x-1/2 z-50 w-full max-w-lg mx-4"
            >
              <div
                className="rounded-xl shadow-2xl overflow-hidden"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                {/* Search input */}
                <div
                  className="flex items-center gap-3 px-4 py-3 border-b"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Поиск по сайту..."
                    className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                    autoFocus
                  />
                  <kbd
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono text-muted-foreground"
                    style={{ background: "hsl(var(--muted))" }}
                  >
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-[300px] overflow-y-auto p-2">
                  {results.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      Ничего не найдено
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {results.map((result, index) => (
                        <button
                          key={result.id}
                          onClick={() => handleSelect(result.href)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors"
                          style={{
                            background:
                              index === selectedIndex
                                ? "hsl(var(--muted))"
                                : "transparent",
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "hsl(var(--background))" }}
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
                          <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div
                  className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground border-t"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <div className="flex items-center gap-2">
                    <kbd
                      className="px-1.5 py-0.5 rounded font-mono"
                      style={{ background: "hsl(var(--muted))" }}
                    >
                      ↑↓
                    </kbd>
                    <span>навигация</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd
                      className="px-1.5 py-0.5 rounded font-mono"
                      style={{ background: "hsl(var(--muted))" }}
                    >
                      ↵
                    </kbd>
                    <span>выбрать</span>
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
