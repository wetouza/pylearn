"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Leaf } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

const themes = [
  { id: "dark", name: "Тёмная", icon: Moon, color: "#00f5ff" },
  { id: "light", name: "Светлая", icon: Sun, color: "#f59e0b" },
  { id: "mono", name: "Mono", icon: Monitor, color: "#ffffff" },
  { id: "avocado", name: "Avocado", icon: Leaf, color: "#22c55e" },
] as const;

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [ripple, setRipple] = React.useState<{
    key: number;
    x: number;
    y: number;
    color: string;
  } | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Закрытие меню при клике вне
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Убираем ripple после анимации
  React.useEffect(() => {
    if (ripple) {
      const timer = setTimeout(() => setRipple(null), 1200);
      return () => clearTimeout(timer);
    }
  }, [ripple]);

  const handleThemeChange = (newTheme: string, e: React.MouseEvent) => {
    if (newTheme === theme) {
      setIsOpen(false);
      return;
    }

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    const themeData = themes.find(t => t.id === newTheme);
    
    // Запускаем волну
    setRipple({
      key: Date.now(),
      x,
      y,
      color: themeData?.color || "#00f5ff",
    });

    // Плавная смена темы с небольшой задержкой для эффекта
    setTimeout(() => {
      setTheme(newTheme);
    }, 100);
    
    setIsOpen(false);
  };

  const currentTheme = themes.find(t => t.id === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-lg">
        <span className="h-5 w-5" />
      </Button>
    );
  }

  const maxSize = Math.max(window.innerWidth, window.innerHeight) * 3;

  return (
    <>
      <div className="relative">
        <Button
          ref={buttonRef}
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg relative overflow-hidden group"
        >
          <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/10 to-primary/5" />
          
          <motion.div
            key={theme}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <CurrentIcon className="h-5 w-5" style={{ color: currentTheme.color }} />
          </motion.div>

          <span className="sr-only">Выбрать тему</span>
        </Button>

        {/* Dropdown menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 p-2 rounded-xl border shadow-lg z-50 min-w-[160px]"
              style={{
                background: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
              }}
            >
              {themes.map((t) => {
                const Icon = t.icon;
                const isActive = theme === t.id;
                
                return (
                  <motion.button
                    key={t.id}
                    onClick={(e) => handleThemeChange(t.id, e)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-primary/10" 
                        : "hover:bg-accent"
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon 
                      className="h-4 w-4" 
                      style={{ color: t.color }}
                    />
                    <span>{t.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTheme"
                        className="ml-auto w-2 h-2 rounded-full"
                        style={{ background: t.color }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ripple wave effect */}
      {mounted && createPortal(
        <AnimatePresence>
          {ripple && (
            <div 
              key={ripple.key}
              className="fixed inset-0 pointer-events-none overflow-hidden"
              style={{ zIndex: 99999 }}
            >
              {/* Основная волна с градиентом */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  translateX: "-50%",
                  translateY: "-50%",
                  background: `radial-gradient(circle, ${ripple.color}20 0%, ${ripple.color}10 30%, transparent 60%)`,
                }}
                initial={{ width: 0, height: 0, opacity: 1 }}
                animate={{ 
                  width: maxSize, 
                  height: maxSize, 
                  opacity: 0,
                }}
                transition={{ 
                  duration: 1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />

              {/* Светящееся кольцо */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  translateX: "-50%",
                  translateY: "-50%",
                  border: `2px solid ${ripple.color}60`,
                  boxShadow: `0 0 40px 10px ${ripple.color}30`,
                }}
                initial={{ width: 20, height: 20, opacity: 1 }}
                animate={{ 
                  width: maxSize, 
                  height: maxSize, 
                  opacity: 0,
                }}
                transition={{ 
                  duration: 1.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />

              {/* Второе кольцо */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  translateX: "-50%",
                  translateY: "-50%",
                  border: `1px solid ${ripple.color}40`,
                }}
                initial={{ width: 10, height: 10, opacity: 0.8 }}
                animate={{ 
                  width: maxSize * 0.85, 
                  height: maxSize * 0.85, 
                  opacity: 0,
                }}
                transition={{ 
                  duration: 0.9,
                  delay: 0.05,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />

              {/* Центральная вспышка */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  translateX: "-50%",
                  translateY: "-50%",
                  background: `radial-gradient(circle, ${ripple.color}80 0%, transparent 70%)`,
                }}
                initial={{ width: 30, height: 30, opacity: 1 }}
                animate={{ 
                  width: 150, 
                  height: 150, 
                  opacity: 0,
                }}
                transition={{ 
                  duration: 0.4,
                  ease: "easeOut",
                }}
              />
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
