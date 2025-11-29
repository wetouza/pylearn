"use client";

import { useState, useMemo, useCallback } from "react";
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
  const { addToast } = useToast();

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="fixed right-0 top-0 bottom-0 w-full max-w-2xl"
          style={{
            backgroundColor: "hsl(var(--background))",
            borderLeft: "1px solid hsl(var(--border))",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4"
            style={{ borderBottom: "1px solid hsl(var(--border))" }}
          >
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
              <span className="font-semibold">Библиотека сниппетов</span>
              <span className="text-xs text-muted-foreground">
                ({snippets.length} сниппетов)
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
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
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/50 border border-border outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Categories */}
          {!searchQuery && (
            <div className="p-4 overflow-x-auto" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
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
                    className="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5"
                    style={{
                      backgroundColor: selectedCategory === cat.id ? "hsl(var(--primary))" : "hsl(var(--muted))",
                      color: selectedCategory === cat.id ? "hsl(var(--primary-foreground))" : "inherit",
                    }}
                  >
                    <span>{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-hidden flex">
            {/* Snippets list */}
            <div 
              className="w-1/2 overflow-y-auto p-4 space-y-2"
              style={{ borderRight: "1px solid hsl(var(--border))" }}
            >
              {filteredSnippets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Ничего не найдено</p>
                </div>
              ) : (
                filteredSnippets.map((snippet) => (
                  <motion.button
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
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{snippet.title}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {snippet.description}
                    </p>
                    <div className="flex gap-1 mt-2">
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
                  </motion.button>
                ))
              )}
            </div>

            {/* Code preview */}
            <div className="w-1/2 overflow-y-auto p-4">
              {selectedSnippet ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{selectedSnippet.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedSnippet.description}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(selectedSnippet)}
                      className="gap-2"
                    >
                      {copiedId === selectedSnippet.id ? (
                        <>
                          <Check className="w-4 h-4 text-green-500" />
                          Скопировано
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Копировать
                        </>
                      )}
                    </Button>
                  </div>

                  <pre
                    className="p-4 rounded-xl overflow-x-auto text-sm font-mono"
                    style={{
                      backgroundColor: "hsl(var(--muted) / 0.5)",
                      border: "1px solid hsl(var(--border))",
                    }}
                  >
                    <code>{selectedSnippet.code}</code>
                  </pre>

                  <div className="flex flex-wrap gap-1 mt-4">
                    {selectedSnippet.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-lg text-xs"
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
                    <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Выбери сниппет слева</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Trigger button for header
export function SnippetsTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
      style={{
        backgroundColor: "hsl(var(--muted) / 0.5)",
        border: "1px solid hsl(var(--border))",
      }}
      title="Библиотека сниппетов"
    >
      <Code className="w-4 h-4" />
      <span className="hidden sm:inline">Сниппеты</span>
    </button>
  );
}
