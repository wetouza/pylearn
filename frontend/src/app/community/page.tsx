"use client";

import { motion } from "framer-motion";
import {
  MessageCircle,
  ExternalLink,
  Users,
  BookOpen,
  Code,
  Youtube,
  Globe,
  Star,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FadeIn } from "@/components/shared/motion";

const telegramChannels = [
  {
    category: "🐍 Python",
    channels: [
      { name: "@pythonist", desc: "Новости Python, туториалы", members: "50K+", url: "https://t.me/pythonist", recommended: true },
      { name: "@python_scripts", desc: "Готовые скрипты и примеры", members: "30K+", url: "https://t.me/python_scripts" },
      { name: "@pythonl", desc: "Уроки и статьи по Python", members: "40K+", url: "https://t.me/pythonl" },
    ],
  },
  {
    category: "💻 Программирование",
    channels: [
      { name: "@proglib", desc: "Библиотека программиста", members: "200K+", url: "https://t.me/proglib", recommended: true },
      { name: "@tproger", desc: "Типичный программист", members: "150K+", url: "https://t.me/tproger" },
      { name: "@habr_com", desc: "Хабр — статьи и новости", members: "100K+", url: "https://t.me/habr_com" },
    ],
  },
  {
    category: "📚 Книги и курсы",
    channels: [
      { name: "@progbook", desc: "Книги по программированию", members: "35K+", url: "https://t.me/progbook", recommended: true },
      { name: "@it_books_archive", desc: "IT книги бесплатно", members: "40K+", url: "https://t.me/it_books_archive" },
    ],
  },
];

const youtubeChannels = [
  {
    category: "🇷🇺 Русскоязычные",
    channels: [
      { name: "Тимофей Хирьянов", desc: "МФТИ, алгоритмы, основы Python", subs: "100K+", url: "https://youtube.com/@tkhirianov", recommended: true },
      { name: "selfedu", desc: "Python, алгоритмы, математика", subs: "300K+", url: "https://youtube.com/@selfedu_rus", recommended: true },
      { name: "Диджитализируй!", desc: "Python, автоматизация", subs: "200K+", url: "https://youtube.com/@t0digital" },
    ],
  },
  {
    category: "🌍 Англоязычные",
    channels: [
      { name: "Corey Schafer", desc: "Лучший Python туториал", subs: "1M+", url: "https://youtube.com/@coreyms", recommended: true },
      { name: "freeCodeCamp", desc: "Полные курсы бесплатно", subs: "8M+", url: "https://youtube.com/@freecodecamp", recommended: true },
      { name: "Tech With Tim", desc: "Python проекты, игры", subs: "1M+", url: "https://youtube.com/@TechWithTim" },
    ],
  },
];

const websites = [
  { name: "docs.python.org", desc: "Официальная документация Python", url: "https://docs.python.org/3/", recommended: true },
  { name: "Real Python", desc: "Качественные туториалы", url: "https://realpython.com/", recommended: true },
  { name: "Python Tutor", desc: "Визуализация выполнения кода", url: "https://pythontutor.com/" },
  { name: "W3Schools", desc: "Интерактивные уроки", url: "https://www.w3schools.com/python/" },
  { name: "Хабр", desc: "Статьи на русском", url: "https://habr.com/ru/hub/python/" },
];

const practiceResources = [
  { name: "Codewars", desc: "Задачи с системой рангов", url: "https://www.codewars.com/", difficulty: "Легко", recommended: true },
  { name: "LeetCode", desc: "Алгоритмические задачи", url: "https://leetcode.com/", difficulty: "Средне" },
  { name: "HackerRank", desc: "Задачи + сертификаты", url: "https://www.hackerrank.com/", difficulty: "Легко", recommended: true },
  { name: "Exercism", desc: "Бесплатное менторство", url: "https://exercism.org/tracks/python", difficulty: "Легко" },
  { name: "Project Euler", desc: "Математические задачи", url: "https://projecteuler.net/", difficulty: "Сложно" },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="container max-w-5xl mx-auto px-4">
          <FadeIn>
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4"
                style={{ background: "hsl(var(--primary) / 0.1)" }}
              >
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: "hsl(var(--primary))" }} />
                <span className="text-xs sm:text-sm font-medium" style={{ color: "hsl(var(--primary))" }}>
                  Сообщество
                </span>
              </motion.div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                Полезные <span className="gradient-text">ресурсы</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                Проверенные каналы, курсы и платформы для изучения Python
              </p>
            </div>

            {/* Practice Resources - First */}
            <section className="mb-10 sm:mb-14">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                <Code className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "hsl(145 60% 45%)" }} />
                Практика кода
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Теория без практики бесполезна. Решай минимум 1 задачу в день!
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {practiceResources.map((res, i) => (
                  <motion.a
                    key={res.name}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative p-4 rounded-xl hover:scale-[1.02] transition-transform"
                    style={{
                      background: "hsl(var(--card))",
                      border: res.recommended
                        ? "1px solid hsl(145 60% 45% / 0.3)"
                        : "1px solid hsl(var(--border))",
                    }}
                  >
                    {res.recommended && (
                      <Star
                        className="absolute top-3 right-3 w-4 h-4"
                        style={{ color: "hsl(145 60% 45%)" }}
                        fill="hsl(145 60% 45%)"
                      />
                    )}
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{res.name}</span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded"
                        style={{
                          background:
                            res.difficulty === "Легко"
                              ? "hsl(145 60% 45% / 0.2)"
                              : res.difficulty === "Средне"
                                ? "hsl(45 90% 50% / 0.2)"
                                : "hsl(0 70% 50% / 0.2)",
                          color:
                            res.difficulty === "Легко"
                              ? "hsl(145 60% 45%)"
                              : res.difficulty === "Средне"
                                ? "hsl(45 90% 50%)"
                                : "hsl(0 70% 50%)",
                        }}
                      >
                        {res.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{res.desc}</p>
                  </motion.a>
                ))}
              </div>
            </section>

            {/* YouTube Channels */}
            <section className="mb-10 sm:mb-14">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                <Youtube className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                YouTube каналы
              </h2>

              <div className="space-y-6 sm:space-y-8">
                {youtubeChannels.map((cat, catIdx) => (
                  <motion.div
                    key={cat.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: catIdx * 0.05 }}
                  >
                    <h3 className="font-semibold text-sm sm:text-base mb-3">{cat.category}</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {cat.channels.map((channel) => (
                        <a
                          key={channel.name}
                          href={channel.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative p-4 rounded-xl hover:scale-[1.02] transition-transform"
                          style={{
                            background: "hsl(var(--card))",
                            border: channel.recommended
                              ? "1px solid hsl(0 70% 50% / 0.3)"
                              : "1px solid hsl(var(--border))",
                          }}
                        >
                          {channel.recommended && (
                            <Star
                              className="absolute top-3 right-3 w-4 h-4 text-red-500"
                              fill="currentColor"
                            />
                          )}
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-red-500">{channel.name}</span>
                            <span className="text-[10px] text-muted-foreground">{channel.subs}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{channel.desc}</p>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Websites */}
            <section className="mb-10 sm:mb-14">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "hsl(var(--primary))" }} />
                Документация и статьи
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {websites.map((site, i) => (
                  <motion.a
                    key={site.name}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative p-4 rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-between"
                    style={{
                      background: "hsl(var(--card))",
                      border: site.recommended
                        ? "1px solid hsl(var(--primary) / 0.3)"
                        : "1px solid hsl(var(--border))",
                    }}
                  >
                    <div>
                      <div className="font-medium text-sm flex items-center gap-2">
                        {site.name}
                        {site.recommended && (
                          <Star
                            className="w-3.5 h-3.5"
                            style={{ color: "hsl(var(--primary))" }}
                            fill="hsl(var(--primary))"
                          />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{site.desc}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </motion.a>
                ))}
              </div>
            </section>

            {/* Telegram Channels */}
            <section className="mb-10 sm:mb-14">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "hsl(200 80% 50%)" }} />
                Telegram каналы
              </h2>

              <div className="space-y-6 sm:space-y-8">
                {telegramChannels.map((cat, catIdx) => (
                  <motion.div
                    key={cat.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: catIdx * 0.05 }}
                  >
                    <h3 className="font-semibold text-sm sm:text-base mb-3">{cat.category}</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {cat.channels.map((channel) => (
                        <a
                          key={channel.name}
                          href={channel.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative p-4 rounded-xl hover:scale-[1.02] transition-transform"
                          style={{
                            background: "hsl(var(--card))",
                            border: channel.recommended
                              ? "1px solid hsl(200 80% 50% / 0.3)"
                              : "1px solid hsl(var(--border))",
                          }}
                        >
                          {channel.recommended && (
                            <Star
                              className="absolute top-3 right-3 w-4 h-4"
                              style={{ color: "hsl(200 80% 50%)" }}
                              fill="hsl(200 80% 50%)"
                            />
                          )}
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm" style={{ color: "hsl(200 80% 50%)" }}>
                              {channel.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{channel.members}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{channel.desc}</p>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Tip */}
            <div
              className="p-4 sm:p-6 rounded-xl text-center"
              style={{
                background: "linear-gradient(135deg, hsl(var(--gradient-start) / 0.1), hsl(var(--gradient-end) / 0.1))",
                border: "1px solid hsl(var(--primary) / 0.2)",
              }}
            >
              <BookOpen className="w-8 h-8 mx-auto mb-3" style={{ color: "hsl(var(--primary))" }} />
              <h3 className="font-semibold mb-2">Совет</h3>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                Не пытайся изучить всё сразу. Выбери один YouTube канал, одну платформу для практики и
                занимайся регулярно. Постоянство важнее интенсивности!
              </p>
            </div>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </div>
  );
}
