"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code, 
  Search, 
  Copy, 
  Check, 
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { snippets, snippetCategories, searchSnippets, getSnippetsByCategory, CodeSnippet } from "@/data/snippets";
import { useToast } from "./toast";

interface SnippetsLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SnippetsLibrary({ isOpen, onClose }: SnippetsLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Filter snippets
  const filteredSnippets = useMemo(() => {
    if (searchQuery) {
      return searchSnippets(searchQuery);
    }
    if (selectedCategory) {
      return getSnippetsByCategory(selectedCategory);
    }
    return snippets;
  }, [searchQuery, selectedCategory]);

  // Copy to clipboard
  const handleCopy = useCallback(async (snippet: CodeSnippet) => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopiedId(snippet.id);
      addToast({
        type: "success",
        title: "Скопировано!",
        description: snippet.title,
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      addToast({
        type: "error",
        title: "Ошибка",
        description: "Не удалось скопировать",
      });
    }
  }, [addToast]);

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSelectedCategory(null);
      setSelectedSnippet(null);
    }
  }, [isOpen]);

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998] touch-none"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed right-0 top-0 h-full w-full sm:w-[90vw] md:w-[600px] lg:w-[700px] z-[9999] flex flex-col"
            style={{
              backgroundColor: "hsl(var(--background))",
              borderLeft: "1px solid hsl(var(--border))",
              boxShadow: "-10px 0 30px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 flex-shrink-0"
              style={{ borderBottom: "1px solid hsl(var(--border))" }}
            >
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
                <span className="font-semibold">Библиотека сниппетов</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  ({snippets.length})
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 flex-shrink-0" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedCategory(null);
                  }}
                  placeholder="Поиск сниппетов..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/50 border border-border outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
            </div>

            {/* Categories - horizontal scroll */}
            {!searchQuery && (
              <div 
                className="p-3 flex-shrink-0 overflow-x-auto scrollbar-hide" 
                style={{ borderBottom: "1px solid hsl(var(--border))" }}
              >
                <div className="flex gap-2 min-w-max">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
                    style={{
                      backgroundColor: !selectedCategory ? "hsl(var(--primary))" : "hsl(var(--muted))",
                      color: !selectedCategory ? "hsl(var(--primary-foreground))" : "inherit",
                    }}
                  >
                    Все
                  </button>
                  {snippetCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1"
                      style={{
                        backgroundColor: selectedCategory === cat.id ? "hsl(var(--primary))" : "hsl(var(--muted))",
                        color: selectedCategory === cat.id ? "hsl(var(--primary-foreground))" : "inherit",
                      }}
                    >
                      <span>{cat.icon}</span>
                      <span className="hidden sm:inline">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content - split view */}
            <div className="flex-1 overflow-hidden flex flex-col sm:flex-row min-h-0">
              {/* Snippets list */}
              <div 
                className="w-full sm:w-1/2 overflow-y-auto p-3 space-y-2 overscroll-contain"
                style={{ 
                  borderRight: "1px solid hsl(var(--border))",
                  minHeight: "200px",
                  maxHeight: "calc(100vh - 200px)",
                }}
              >
                {filteredSnippets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Code className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Ничего не найдено</p>
                  </div>
                ) : (
                  filteredSnippets.map((snippet) => (
                    <button
                      key={snippet.id}
                      onClick={() => setSelectedSnippet(snippet)}
                      className="w-full p-3 rounded-xl text-left transition-all"
                      style={{
                        backgroundColor: selectedSnippet?.id === snippet.id 
                          ? "hsl(var(--primary) / 0.1)" 
                          : "hsl(var(--muted) / 0.5)",
                        border: selectedSnippet?.id === snippet.id 
                          ? "1px solid hsl(var(--primary) / 0.3)"
                          : "1px solid transparent",
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{snippet.title}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {snippet.description}
                      </p>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {snippet.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 rounded text-[10px]"
                            style={{ backgroundColor: "hsl(var(--muted))" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Code preview */}
              <div 
                className="w-full sm:w-1/2 overflow-y-auto p-3 overscroll-contain"
                style={{ 
                  minHeight: "200px",
                  maxHeight: "calc(100vh - 200px)",
                }}
              >
                {selectedSnippet ? (
                  <div className="h-full flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-3 flex-shrink-0">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm">{selectedSnippet.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {selectedSnippet.description}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(selectedSnippet)}
                        className="gap-1.5 flex-shrink-0 text-xs"
                      >
                        {copiedId === selectedSnippet.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-500" />
                            <span className="hidden sm:inline">Скопировано</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Копировать</span>
                          </>
                        )}
                      </Button>
                    </div>

                    <pre
                      className="p-3 rounded-xl overflow-auto text-xs font-mono flex-1 min-h-0"
                      style={{
                        backgroundColor: "hsl(var(--muted) / 0.5)",
                        border: "1px solid hsl(var(--border))",
                      }}
                    >
                      <code className="whitespace-pre">{selectedSnippet.code}</code>
                    </pre>

                    <div className="flex flex-wrap gap-1 mt-3 flex-shrink-0">
                      {selectedSnippet.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-lg text-[10px]"
                          style={{ backgroundColor: "hsl(var(--muted))" }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Code className="w-10 h-10 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Выбери сниппет</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(content, document.body);
}
