"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 dot-pattern opacity-20" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center max-w-md"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-[120px] sm:text-[180px] font-bold leading-none gradient-text select-none"
        >
          404
        </motion.div>

        {/* Message */}
        <h1 className="text-xl sm:text-2xl font-bold mb-2 -mt-4">
          Страница не найдена
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-8">
          Похоже, эта страница убежала учить Python. Давай вернёмся на главную!
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="glow" className="gap-2">
              <Home className="w-4 h-4" />
              На главную
            </Button>
          </Link>
          <Link href="/guides">
            <Button variant="outline" className="gap-2">
              <Search className="w-4 h-4" />
              К урокам
            </Button>
          </Link>
        </div>

        {/* Fun Python code */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 glass-card p-4 rounded-xl text-left"
        >
          <pre className="text-xs sm:text-sm font-mono">
            <code>
              <span className="text-muted-foreground"># Ошибка 404</span>{"\n"}
              <span className="syntax-keyword">try</span>:{"\n"}
              {"    "}page = <span className="syntax-function">find_page</span>(<span className="syntax-string">&quot;/...&quot;</span>){"\n"}
              <span className="syntax-keyword">except</span> <span className="syntax-function">PageNotFoundError</span>:{"\n"}
              {"    "}<span className="syntax-keyword">print</span>(<span className="syntax-string">&quot;Упс! 🐍&quot;</span>)
            </code>
          </pre>
        </motion.div>
      </motion.div>
    </div>
  );
}
