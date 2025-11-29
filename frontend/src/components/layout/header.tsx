"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Code, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CommandMenu } from "@/components/shared/command-menu";
import { SnippetsLibrary } from "@/components/shared/snippets-library";
import { PomodoroTimer } from "@/components/shared/pomodoro-timer";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Гайды", href: "/guides" },
  { name: "VS Code", href: "/vscode" },
  { name: "Печать", href: "/typing" },
  { name: "Глоссарий", href: "/glossary" },
  { name: "Тренажёры", href: "/trainers" },
  { name: "Ресурсы", href: "/resources" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Закрываем мобильное меню при смене страницы
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b"
          : "bg-transparent"
      )}
      style={{ borderColor: isScrolled ? "hsl(var(--border))" : "transparent" }}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, hsl(var(--gradient-start)), hsl(var(--gradient-end)))" }}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </motion.div>
            <span className="text-lg sm:text-xl font-bold">
              Py<span className="gradient-text">Learn</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    className={cn(
                      "relative px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-lg -z-10"
                        style={{ background: "hsl(var(--muted))" }}
                        layoutId="navbar-active"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Snippets button */}
            <button
              onClick={() => setShowSnippets(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
              style={{
                backgroundColor: "hsl(var(--muted) / 0.5)",
                border: "1px solid hsl(var(--border))",
              }}
              title="Библиотека сниппетов"
            >
              <Code className="w-4 h-4" />
              <span className="hidden md:inline">Сниппеты</span>
            </button>

            {/* Pomodoro button */}
            <button
              onClick={() => setShowPomodoro(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
              style={{
                backgroundColor: "hsl(var(--muted) / 0.5)",
                border: "1px solid hsl(var(--border))",
              }}
              title="Pomodoro Timer"
            >
              <Timer className="w-4 h-4" />
            </button>

            <CommandMenu />
            <ThemeToggle />

            <Link href="/guides" className="hidden md:block">
              <Button variant="glow" size="sm" className="btn-shimmer">
                Начать обучение
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden backdrop-blur-xl border-b"
            style={{ 
              background: "hsl(var(--background) / 0.95)",
              borderColor: "hsl(var(--border))"
            }}
          >
            <div className="container mx-auto px-4 py-3 space-y-1">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      style={{ background: isActive ? "hsl(var(--muted))" : "transparent" }}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navigation.length * 0.03 }}
                className="pt-2"
              >
                <Link href="/guides">
                  <Button variant="glow" className="w-full btn-shimmer">
                    Начать обучение
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <SnippetsLibrary isOpen={showSnippets} onClose={() => setShowSnippets(false)} />
      <PomodoroTimer isOpen={showPomodoro} onClose={() => setShowPomodoro(false)} />
    </header>
  );
}
