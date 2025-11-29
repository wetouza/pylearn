"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Twitter, MessageCircle, Heart, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  learn: [
    { name: "Гайды по Python", href: "/guides" },
    { name: "Настройка VS Code", href: "/vscode" },
    { name: "Тренажёр печати", href: "/typing" },
    { name: "Глоссарий", href: "/glossary" },
    { name: "Тренажёры", href: "/trainers" },
    { name: "Мой прогресс", href: "/goals" },
  ],
  resources: [
    { name: "Полезные ресурсы", href: "/resources" },
    { name: "Документация Python", href: "https://docs.python.org/3/", external: true },
    { name: "Codewars", href: "https://www.codewars.com/", external: true },
    { name: "LeetCode", href: "https://leetcode.com/", external: true },
  ],
  community: [
    { name: "GitHub", href: "https://github.com", external: true, icon: Github },
    { name: "Twitter", href: "https://twitter.com", external: true, icon: Twitter },
    { name: "Discord", href: "https://discord.com", external: true, icon: MessageCircle },
  ],
};

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/10 bg-background/50 backdrop-blur-xl">
      {/* Gradient decoration */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <motion.div
                className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Sparkles className="w-5 h-5 text-background" />
              </motion.div>
              <span className="text-xl font-bold">
                Py<span className="gradient-text">Learn</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Изучай Python с нуля — просто, понятно, эффективно. Платформа для
              тех, кто делает первые шаги в программировании.
            </p>
          </div>

          {/* Learn */}
          <div>
            <h3 className="font-semibold mb-4">Обучение</h3>
            <ul className="space-y-3">
              {footerLinks.learn.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Ресурсы</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    {link.name}
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Сообщество</h3>
            <div className="flex gap-3">
              {footerLinks.community.map((link) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 hover:border-white/20 transition-all"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 PyLearn. Все права защищены.</p>
          <p className="flex items-center gap-1">
            Сделано с <Heart className="w-4 h-4 text-red-500 fill-red-500" /> для
            начинающих программистов
          </p>
        </div>
      </div>
    </footer>
  );
}

