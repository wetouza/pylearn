"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Code,
  Keyboard,
  Dumbbell,
  BookMarked,
  Zap,
  ArrowRight,
  Target,
  X,
  Download,
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
    id: "resources",
    title: "Ресурсы",
    description: "Пиратский гайд — игры, фильмы, софт",
    href: "/resources",
    icon: <Download className="w-4 h-4" />,
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

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  // Debounced query for performance
  const debouncedQuery = useDebounce(query, 100);

  // Mount check for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Build search results with debounced query
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return staticPages;
    }

    const lowerQuery = debouncedQuery.toLowerCase().trim();
    const allResults: SearchResult[] = [];

    // Search static pages
    staticPages.forEach((page) => {
      const titleMatch = page.title.toLowerCase().includes(lowerQuery);
      const descMatch = page.description.toLowerCase().includes(lowerQuery);
      if (titleMatch || descMatch) {
        allResults.push({ ...page, _score: titleMatch ? 2 : 1 } as SearchResult & { _score: number });
      }
    });

    // Search guides
    guides.forEach((guide) => {
      const titleMatch = guide.title.toLowerCase().includes(lowerQuery);
      const descMatch = guide.description.toLowerCase().includes(lowerQuery);
      if (titleMatch || descMatch) {
        allResults.push({
          id: `guide-${guide.id}`,
          title: guide.title,
          description: guide.description,
          href: `/guides/${guide.slug}`,
          icon: <span className="text-base">{guide.icon}</span>,
          category: "Уроки",
          _score: titleMatch ? 2 : 1,
        } as SearchResult & { _score: number });
      }
    });

    // Search glossary (limit to 5)
    let glossaryCount = 0;
    glossaryTerms.forEach((term) => {
      if (glossaryCount >= 5) return;
      const termMatch = term.term.toLowerCase().includes(lowerQuery);
      const defMatch = term.definition.toLowerCase().includes(lowerQuery);
      if (termMatch || defMatch) {
        allResults.push({
          id: `term-${term.id}`,
          title: term.term,
          description: term.simpleExplanation.slice(0, 60) + "...",
          href: `/glossary?search=${encodeURIComponent(term.term)}`,
          icon: <BookMarked className="w-4 h-4" />,
          category: "Глоссарий",
          _score: termMatch ? 2 : 1,
        } as SearchResult & { _score: number });
        glossaryCount++;
      }
    });

    // Sort by score (title matches first)
    return allResults
      .sort((a, b) => ((b as unknown as { _score: number })._score || 0) - ((a as unknown as { _score: number })._score || 0))
      .slice(0, 15);
  }, [debouncedQuery]);

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

  // Open/close handlers
  const openSearch = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  // Navigate to result
  const navigateTo = useCallback(
    (href: string) => {
      closeSearch();
      router.push(href);
    },
    [closeSearch, router]
  );

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          closeSearch();
        } else {
          openSearch();
        }
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        closeSearch();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, openSearch, closeSearch]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Arrow navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            navigateTo(results[selectedIndex].href);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, navigateTo]);

  // Scroll selected item into view
  useEffect(() => {
    if (!isOpen) return;
    const selectedItem = itemRefs.current.get(selectedIndex);
    if (selectedItem) {
      selectedItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex, isOpen]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [debouncedQuery]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Track item refs
  const setItemRef = useCallback((index: number, el: HTMLButtonElement | null) => {
    if (el) {
      itemRefs.current.set(index, el);
    } else {
      itemRefs.current.delete(index);
    }
  }, []);

  // Detect OS for keyboard shortcut display
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes("mac"));
  }, []);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeSearch}
            className="fixed inset-0 z-[9999] touch-none"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            aria-hidden="true"
          />

          {/* Modal Container - Centered */}
          <div 
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:pt-[12vh] sm:pb-[20vh]"
            role="dialog"
            aria-modal="true"
            aria-label="Поиск по сайту"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg sm:max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="rounded-2xl shadow-2xl overflow-hidden"
                style={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                }}
              >
                {/* Search Input */}
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Поиск страниц, уроков, терминов..."
                    className="w-full h-14 sm:h-16 pl-12 pr-12 bg-transparent text-base sm:text-lg outline-none placeholder:text-muted-foreground"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                  <button
                    onClick={closeSearch}
                    className="absolute right-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    type="button"
                    aria-label="Закрыть поиск"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Divider */}
                <div className="h-px bg-border" />

                {/* Results */}
                <div
                  ref={listRef}
                  className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto overscroll-contain scroll-smooth"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "hsl(var(--muted-foreground) / 0.3) transparent",
                  }}
                >
                  {results.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-16 text-center"
                    >
                      <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">
                        Ничего не найдено по запросу &quot;{query}&quot;
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-2">
                        Попробуйте другие ключевые слова
                      </p>
                    </motion.div>
                  ) : (
                    <div className="p-2">
                      {Object.entries(groupedResults).map(([category, items]) => (
                        <div key={category} className="mb-3 last:mb-0">
                          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {category}
                          </div>
                          {items.map((result) => {
                            const globalIndex = results.findIndex((r) => r.id === result.id);
                            const isSelected = globalIndex === selectedIndex;

                            return (
                              <motion.button
                                key={result.id}
                                ref={(el) => setItemRef(globalIndex, el)}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.15, delay: globalIndex * 0.02 }}
                                onClick={() => navigateTo(result.href)}
                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150"
                                style={{
                                  backgroundColor: isSelected ? "hsl(var(--muted))" : "transparent",
                                  transform: isSelected ? "scale(1.01)" : "scale(1)",
                                }}
                                type="button"
                              >
                                <div
                                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-150"
                                  style={{
                                    backgroundColor: isSelected
                                      ? "hsl(var(--primary) / 0.15)"
                                      : "hsl(var(--muted))",
                                    color: isSelected ? "hsl(var(--primary))" : "inherit",
                                  }}
                                >
                                  {result.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium truncate">{result.title}</div>
                                  <div className="text-xs text-muted-foreground truncate mt-0.5">
                                    {result.description}
                                  </div>
                                </div>
                                <AnimatePresence>
                                  {isSelected && (
                                    <motion.div
                                      initial={{ opacity: 0, x: -5 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -5 }}
                                      transition={{ duration: 0.1 }}
                                    >
                                      <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div
                  className="flex items-center justify-between px-4 py-3 text-xs text-muted-foreground"
                  style={{
                    backgroundColor: "hsl(var(--muted) / 0.5)",
                    borderTop: "1px solid hsl(var(--border))",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-background border border-border">↑↓</kbd>
                      <span className="hidden sm:inline">навигация</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-background border border-border">↵</kbd>
                      <span className="hidden sm:inline">открыть</span>
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-background border border-border">esc</kbd>
                    <span className="hidden sm:inline">закрыть</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openSearch}
        className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-150"
        style={{
          backgroundColor: "hsl(var(--muted) / 0.5)",
          border: "1px solid hsl(var(--border))",
        }}
        type="button"
        aria-label="Открыть поиск"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Поиск</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono ml-1 bg-background border border-border">
          {isMac ? "⌘" : <Command className="w-3 h-3" />}K
        </kbd>
      </button>

      {/* Portal for modal */}
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
