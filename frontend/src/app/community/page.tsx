"use client";

import { motion } from "framer-motion";
import { 
  MessageCircle, 
  ExternalLink,
  Users,
  BookOpen,
  Code,
  Sparkles,
  Youtube,
  Globe
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FadeIn } from "@/components/shared/motion";

const telegramChannels = [
  {
    category: "🐍 Python для новичков",
    description: "Каналы и чаты для тех, кто только начинает",
    channels: [
      { name: "@pythonist", desc: "Новости Python, туториалы", members: "50K+", url: "https://t.me/pythonist" },
      { name: "@python_scripts", desc: "Готовые скрипты и примеры", members: "30K+", url: "https://t.me/python_scripts" },
      { name: "@python_beginners", desc: "Чат для новичков, можно спрашивать", members: "15K+", url: "https://t.me/python_beginners" },
      { name: "@pythonl", desc: "Уроки и статьи по Python", members: "40K+", url: "https://t.me/pythonl" },
      { name: "@python_academy", desc: "Академия Python", members: "20K+", url: "https://t.me/python_academy" },
    ]
  },
  {
    category: "💻 Программирование общее",
    description: "IT-сообщества и каналы про разработку",
    channels: [
      { name: "@proglib", desc: "Библиотека программиста", members: "200K+", url: "https://t.me/proglib" },
      { name: "@tproger", desc: "Типичный программист", members: "150K+", url: "https://t.me/tproger" },
      { name: "@habr_com", desc: "Хабр — статьи и новости", members: "100K+", url: "https://t.me/habr_com" },
      { name: "@devkg", desc: "Разработка и карьера", members: "80K+", url: "https://t.me/devkg" },
      { name: "@codecamp", desc: "Обучение программированию", members: "60K+", url: "https://t.me/codecamp" },
      { name: "@webdevblog", desc: "Веб-разработка", members: "45K+", url: "https://t.me/webdevblog" },
    ]
  },
  {
    category: "🎓 Курсы и обучение",
    description: "Бесплатные курсы, материалы, книги",
    channels: [
      { name: "@free_edu_courses", desc: "Бесплатные курсы", members: "100K+", url: "https://t.me/free_edu_courses" },
      { name: "@coursehunters", desc: "Курсы с Coursehunter", members: "50K+", url: "https://t.me/coursehunters" },
      { name: "@it_books_archive", desc: "IT книги бесплатно", members: "40K+", url: "https://t.me/it_books_archive" },
      { name: "@progbook", desc: "Книги по программированию", members: "35K+", url: "https://t.me/progbook" },
      { name: "@udemy_free_rus", desc: "Бесплатные курсы Udemy", members: "25K+", url: "https://t.me/udemy_free_rus" },
    ]
  },
  {
    category: "💼 Работа и карьера",
    description: "Вакансии, фриланс, советы по карьере",
    channels: [
      { name: "@devjobs", desc: "IT вакансии", members: "80K+", url: "https://t.me/devjobs" },
      { name: "@remote_it", desc: "Удалённая работа в IT", members: "60K+", url: "https://t.me/remote_it" },
      { name: "@freelance_hunt", desc: "Фриланс заказы", members: "40K+", url: "https://t.me/freelance_hunt" },
      { name: "@junior_dev", desc: "Вакансии для джунов", members: "30K+", url: "https://t.me/junior_dev" },
      { name: "@it_resume", desc: "Советы по резюме", members: "20K+", url: "https://t.me/it_resume" },
    ]
  },
  {
    category: "🔧 Инструменты разработчика",
    description: "VS Code, Git, Linux и другие инструменты",
    channels: [
      { name: "@vscode_ru", desc: "VS Code советы и расширения", members: "25K+", url: "https://t.me/vscode_ru" },
      { name: "@git_tips", desc: "Git команды и лайфхаки", members: "20K+", url: "https://t.me/git_tips" },
      { name: "@linux_ru", desc: "Linux для разработчиков", members: "50K+", url: "https://t.me/linux_ru" },
      { name: "@docker_ru", desc: "Docker и контейнеризация", members: "30K+", url: "https://t.me/docker_ru" },
    ]
  }
];

const youtubeChannels = [
  {
    category: "🇷🇺 Русскоязычные",
    channels: [
      { name: "Хауди Хо", desc: "Python, веб-разработка, проекты", subs: "1M+", url: "https://youtube.com/@HowdyHoNet" },
      { name: "Гоша Дударь", desc: "Python с нуля, Django, Flask", subs: "500K+", url: "https://youtube.com/@goaborern" },
      { name: "selfedu", desc: "Python, алгоритмы, математика", subs: "300K+", url: "https://youtube.com/@selfedu_rus" },
      { name: "Диджитализируй!", desc: "Python, автоматизация", subs: "200K+", url: "https://youtube.com/@t0digital" },
      { name: "Python Hub Studio", desc: "Проекты на Python", subs: "150K+", url: "https://youtube.com/@PythonHubStudio" },
      { name: "Тимофей Хирьянов", desc: "МФТИ, алгоритмы, основы", subs: "100K+", url: "https://youtube.com/@tkhirianov" },
    ]
  },
  {
    category: "🌍 Англоязычные (с субтитрами)",
    channels: [
      { name: "Corey Schafer", desc: "Лучший Python туториал", subs: "1M+", url: "https://youtube.com/@coreyms" },
      { name: "Tech With Tim", desc: "Python проекты, игры", subs: "1M+", url: "https://youtube.com/@TechWithTim" },
      { name: "Traversy Media", desc: "Веб-разработка, Python", subs: "2M+", url: "https://youtube.com/@TraversyMedia" },
      { name: "freeCodeCamp", desc: "Полные курсы бесплатно", subs: "8M+", url: "https://youtube.com/@freecodecamp" },
      { name: "Fireship", desc: "Быстрые объяснения, тренды", subs: "2M+", url: "https://youtube.com/@Fireship" },
    ]
  }
];

const discordServers = [
  { name: "Python Discord", desc: "Крупнейшее Python сообщество", members: "300K+", url: "https://discord.gg/python" },
  { name: "Pair Programming", desc: "Найди напарника для кодинга", members: "50K+", url: "https://discord.gg/pairprogramming" },
  { name: "The Programmer's Hangout", desc: "Общение разработчиков", members: "150K+", url: "https://discord.gg/programming" },
  { name: "Code Support", desc: "Помощь с кодом", members: "30K+", url: "https://discord.gg/codesupport" },
];

const websites = [
  { name: "Хабр", desc: "Статьи, туториалы, новости IT", url: "https://habr.com/ru/hub/python/" },
  { name: "Tproger", desc: "Статьи для разработчиков", url: "https://tproger.ru/tag/python/" },
  { name: "Python.org", desc: "Официальная документация", url: "https://docs.python.org/3/" },
  { name: "Real Python", desc: "Качественные туториалы (англ)", url: "https://realpython.com/" },
  { name: "Python Tutor", desc: "Визуализация кода", url: "https://pythontutor.com/" },
  { name: "W3Schools Python", desc: "Интерактивные уроки", url: "https://www.w3schools.com/python/" },
];

const practiceResources = [
  { name: "LeetCode", desc: "Алгоритмические задачи", url: "https://leetcode.com/", difficulty: "Средне" },
  { name: "Codewars", desc: "Ката и челленджи", url: "https://www.codewars.com/", difficulty: "Легко" },
  { name: "HackerRank", desc: "Задачи + сертификаты", url: "https://www.hackerrank.com/", difficulty: "Легко" },
  { name: "Exercism", desc: "Менторство + задачи", url: "https://exercism.org/tracks/python", difficulty: "Легко" },
  { name: "Project Euler", desc: "Математические задачи", url: "https://projecteuler.net/", difficulty: "Сложно" },
  { name: "Advent of Code", desc: "Ежегодный челлендж", url: "https://adventofcode.com/", difficulty: "Средне" },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="container max-w-6xl mx-auto px-4">
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
                <span className="text-xs sm:text-sm font-medium" style={{ color: "hsl(var(--primary))" }}>Сообщество</span>
              </motion.div>
              
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                Python <span className="gradient-text">сообщества</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                Telegram каналы, YouTube, Discord и сайты для изучения Python. Русскоязычные приоритетно!
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
              {[
                { icon: MessageCircle, label: "Telegram каналов", value: "25+" },
                { icon: Youtube, label: "YouTube каналов", value: "11" },
                { icon: Users, label: "Discord серверов", value: "4" },
                { icon: Globe, label: "Полезных сайтов", value: "12" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-3 sm:p-4 rounded-xl text-center"
                >
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" style={{ color: "hsl(var(--primary))" }} />
                  <div className="text-lg sm:text-2xl font-bold">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Telegram Channels */}
            <section className="mb-10 sm:mb-16">
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
                    <div className="mb-3">
                      <h3 className="font-semibold text-base sm:text-lg">{cat.category}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{cat.description}</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                      {cat.channels.map((channel) => (
                        <a
                          key={channel.name}
                          href={channel.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-card p-3 sm:p-4 rounded-xl hover:scale-[1.02] transition-transform group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm" style={{ color: "hsl(200 80% 50%)" }}>{channel.name}</span>
                            <span className="text-[10px] sm:text-xs text-muted-foreground">{channel.members}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{channel.desc}</p>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* YouTube Channels */}
            <section className="mb-10 sm:mb-16">
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
                    <h3 className="font-semibold text-base sm:text-lg mb-3">{cat.category}</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                      {cat.channels.map((channel) => (
                        <a
                          key={channel.name}
                          href={channel.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-card p-3 sm:p-4 rounded-xl hover:scale-[1.02] transition-transform"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-red-500">{channel.name}</span>
                            <span className="text-[10px] sm:text-xs text-muted-foreground">{channel.subs}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{channel.desc}</p>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Discord */}
            <section className="mb-10 sm:mb-16">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "hsl(260 80% 60%)" }} />
                Discord серверы
              </h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {discordServers.map((server, i) => (
                  <motion.a
                    key={server.name}
                    href={server.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-4 rounded-xl hover:scale-[1.02] transition-transform"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm" style={{ color: "hsl(260 80% 60%)" }}>{server.name}</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">{server.members}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{server.desc}</p>
                  </motion.a>
                ))}
              </div>
            </section>

            {/* Websites */}
            <section className="mb-10 sm:mb-16">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "hsl(var(--primary))" }} />
                Полезные сайты
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
                    className="glass-card p-4 rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-sm">{site.name}</div>
                      <div className="text-xs text-muted-foreground">{site.desc}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </motion.a>
                ))}
              </div>
            </section>

            {/* Practice */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                <Code className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "hsl(145 60% 45%)" }} />
                Практика кода
              </h2>
              
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
                    className="glass-card p-4 rounded-xl hover:scale-[1.02] transition-transform"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{res.name}</span>
                      <span 
                        className="text-[10px] px-2 py-0.5 rounded"
                        style={{ 
                          background: res.difficulty === "Легко" ? "hsl(145 60% 45% / 0.2)" : 
                                     res.difficulty === "Средне" ? "hsl(45 90% 50% / 0.2)" : "hsl(0 70% 50% / 0.2)",
                          color: res.difficulty === "Легко" ? "hsl(145 60% 45%)" : 
                                 res.difficulty === "Средне" ? "hsl(45 90% 50%)" : "hsl(0 70% 50%)"
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
          </FadeIn>
        </div>
      </main>

      <Footer />
    </div>
  );
}

