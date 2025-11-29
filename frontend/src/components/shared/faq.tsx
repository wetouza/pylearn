"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export function FAQ({ items, title = "Частые вопросы" }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="rounded-xl overflow-hidden"
              style={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-medium text-sm sm:text-base pr-4">
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-4 pb-4 text-sm text-muted-foreground"
                      dangerouslySetInnerHTML={{
                        __html: item.answer.replace(/\n/g, "<br />"),
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Default FAQ items for Python beginners
export const pythonFAQ: FAQItem[] = [
  {
    question: "С чего начать изучение Python?",
    answer:
      "Начни с установки Python и VS Code (у нас есть гайд!), затем пройди раздел «Основы Python». Главное — писать код каждый день, даже по 15-20 минут.",
  },
  {
    question: "Сколько времени нужно, чтобы выучить Python?",
    answer:
      "Основы можно освоить за 1-2 месяца при регулярных занятиях. Для уверенного программирования нужно 6-12 месяцев практики. Но первую программу ты напишешь уже через 10 минут!",
  },
  {
    question: "Нужно ли знать математику для программирования?",
    answer:
      "Для начала — нет! Базовая арифметика (сложение, вычитание, умножение, деление) — это всё, что нужно. Продвинутая математика понадобится только для специфических областей вроде машинного обучения.",
  },
  {
    question: "Какой редактор кода лучше использовать?",
    answer:
      "Мы рекомендуем VS Code — он бесплатный, мощный и имеет отличную поддержку Python. У нас есть подробный гайд по его настройке.",
  },
  {
    question: "Где практиковаться после уроков?",
    answer:
      "Codewars — отличный выбор для начинающих. Начни с задач 8 kyu (самые простые) и постепенно повышай сложность. Также рекомендуем HackerRank и Exercism.",
  },
  {
    question: "Что делать, если код не работает?",
    answer:
      "1. Внимательно прочитай сообщение об ошибке\n2. Проверь отступы (в Python они важны!)\n3. Проверь кавычки и скобки\n4. Погугли ошибку\n5. Спроси в сообществе — мы поможем!",
  },
  {
    question: "Python 2 или Python 3?",
    answer:
      "Только Python 3! Python 2 устарел и больше не поддерживается. Все наши уроки используют Python 3.",
  },
  {
    question: "Можно ли найти работу, зная только Python?",
    answer:
      "Да! Python востребован в веб-разработке (Django, Flask), анализе данных, автоматизации, DevOps и машинном обучении. Но помимо языка нужно изучить инструменты конкретной области.",
  },
];
