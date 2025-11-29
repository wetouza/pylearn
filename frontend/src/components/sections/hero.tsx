"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Code2, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
      {/* Background */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-[80px] sm:blur-[120px]"
        style={{ background: "hsl(var(--gradient-start) / 0.15)" }}
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-[80px] sm:blur-[120px]"
        style={{ background: "hsl(var(--gradient-end) / 0.15)" }}
        animate={{
          x: [0, -30, 0],
          y: [0, -20, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <span 
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full border"
              style={{ 
                background: "hsl(var(--card) / 0.5)",
                borderColor: "hsl(var(--border))"
              }}
            >
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: "hsl(var(--primary))" }} />
              <span className="text-muted-foreground">Для полных новичков</span>
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Изучай{" "}
            <span className="gradient-text">Python</span>
            <br />
            <span className="text-muted-foreground">с нуля</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Простые объяснения сложных вещей. Пошаговые гайды и поддержка на каждом этапе.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/guides" className="w-full sm:w-auto">
              <Button variant="glow" size="lg" className="w-full sm:w-auto group btn-shimmer">
                Начать обучение
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="https://youtube.com/@pylearn" target="_blank" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto group">
                <Play className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                YouTube канал
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {[
              { icon: Code2, value: "50+", label: "Уроков" },
              { icon: Users, value: "1K+", label: "Учеников" },
              { icon: Zap, value: "100%", label: "Бесплатно" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              >
                <div 
                  className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl mb-2 border"
                  style={{ 
                    background: "hsl(var(--card) / 0.5)",
                    borderColor: "hsl(var(--border))"
                  }}
                >
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "hsl(var(--primary))" }} />
                </div>
                <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Code snippets - only on large screens */}
        <motion.div
          className="absolute left-4 lg:left-10 top-1/3 hidden xl:block"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="glass-card p-3 rounded-xl">
            <pre className="text-xs font-mono">
              <code>
                <span className="syntax-keyword">print</span>
                <span>(</span>
                <span className="syntax-string">&quot;Hello!&quot;</span>
                <span>)</span>
              </code>
            </pre>
          </div>
        </motion.div>

        <motion.div
          className="absolute right-4 lg:right-10 top-1/2 hidden xl:block"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="glass-card p-3 rounded-xl">
            <pre className="text-xs font-mono">
              <code>
                <span className="syntax-keyword">for</span>
                <span> i </span>
                <span className="syntax-keyword">in</span>
                <span> </span>
                <span className="syntax-function">range</span>
                <span>(</span>
                <span className="syntax-number">5</span>
                <span>):</span>
              </code>
            </pre>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <motion.div
          className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border-2 flex items-start justify-center p-1.5 sm:p-2"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <motion.div
            className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full"
            style={{ background: "hsl(var(--primary))" }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
