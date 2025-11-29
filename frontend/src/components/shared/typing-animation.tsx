"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypingAnimationProps {
  code: string;
  speed?: number;
  delay?: number;
  loop?: boolean;
  className?: string;
}

export function TypingAnimation({
  code,
  speed = 50,
  delay = 1000,
  loop = true,
  className = "",
}: TypingAnimationProps) {
  const [displayedCode, setDisplayedCode] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startDelay);
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (currentIndex < code.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode(code.slice(0, currentIndex + 1));
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (loop) {
      const resetTimeout = setTimeout(() => {
        setDisplayedCode("");
        setCurrentIndex(0);
      }, 3000);

      return () => clearTimeout(resetTimeout);
    }
  }, [currentIndex, code, speed, loop, isTyping]);

  return (
    <div className={`font-mono text-sm ${className}`}>
      <pre className="whitespace-pre-wrap">
        <code>
          {displayedCode}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-2 h-4 ml-0.5 align-middle"
            style={{ background: "hsl(var(--primary))" }}
          />
        </code>
      </pre>
    </div>
  );
}

// Pre-defined code snippets for the hero section
export const heroCodeSnippets = [
  `# Привет, Python! 🐍
name = "Мир"
print(f"Привет, {name}!")`,

  `# Простой цикл
for i in range(5):
    print(f"Шаг {i + 1}")`,

  `# Функция
def greet(name):
    return f"Привет, {name}!"

print(greet("Python"))`,
];
