"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MatrixRain } from "@/components/shared/matrix-rain";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Matrix Rain Background */}
      <MatrixRain opacity={0.12} />
      
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: "radial-gradient(circle at center, transparent 0%, hsl(var(--background)) 70%)",
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center max-w-md"
      >
        {/* Glitch 404 Number */}
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative text-[120px] sm:text-[180px] font-bold leading-none select-none"
        >
          <span className="gradient-text relative">
            404
            {/* Glitch layers */}
            <span 
              className="absolute inset-0 gradient-text opacity-70"
              style={{ 
                clipPath: "inset(10% 0 60% 0)",
                transform: "translate(-2px, 0)",
                animation: "glitch1 2s infinite linear alternate-reverse",
              }}
            >
              404
            </span>
            <span 
              className="absolute inset-0 gradient-text opacity-70"
              style={{ 
                clipPath: "inset(60% 0 10% 0)",
                transform: "translate(2px, 0)",
                animation: "glitch2 3s infinite linear alternate-reverse",
              }}
            >
              404
            </span>
          </span>
        </motion.div>

        {/* Message */}
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl sm:text-2xl font-bold mb-2 -mt-4"
        >
          Страница не найдена
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm sm:text-base text-muted-foreground mb-8"
        >
          Ты попал в матрицу! Эта страница существует только в параллельной вселенной.
        </motion.p>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/">
            <Button variant="glow" className="gap-2">
              <Home className="w-4 h-4" />
              Выйти из матрицы
            </Button>
          </Link>
          <Link href="/guides">
            <Button variant="outline" className="gap-2">
              <Search className="w-4 h-4" />
              К урокам
            </Button>
          </Link>
        </motion.div>

        {/* Fun Python code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 glass-card p-4 rounded-xl text-left backdrop-blur-sm"
          style={{ background: "hsl(var(--card) / 0.8)" }}
        >
          <pre className="text-xs sm:text-sm font-mono overflow-x-auto">
            <code>
              <span className="text-green-500"># Ты выбрал красную таблетку</span>{"\n"}
              <span className="text-purple-400">import</span> matrix{"\n"}
              {"\n"}
              <span className="text-purple-400">try</span>:{"\n"}
              {"    "}reality = matrix.<span className="text-yellow-400">find_page</span>(<span className="text-green-400">&quot;/...&quot;</span>){"\n"}
              <span className="text-purple-400">except</span> <span className="text-red-400">PageNotFoundError</span>:{"\n"}
              {"    "}<span className="text-purple-400">print</span>(<span className="text-green-400">&quot;Wake up, Neo... 🐍&quot;</span>)
            </code>
          </pre>
        </motion.div>

        {/* Hidden hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.5 }}
          className="mt-6 text-xs text-muted-foreground"
        >
          Попробуй ввести код Konami на главной странице...
        </motion.p>
      </motion.div>

      {/* Glitch animation styles */}
      <style jsx global>{`
        @keyframes glitch1 {
          0%, 100% { transform: translate(-2px, 0); }
          25% { transform: translate(2px, -1px); }
          50% { transform: translate(-1px, 1px); }
          75% { transform: translate(1px, -2px); }
        }
        @keyframes glitch2 {
          0%, 100% { transform: translate(2px, 0); }
          25% { transform: translate(-2px, 1px); }
          50% { transform: translate(1px, -1px); }
          75% { transform: translate(-1px, 2px); }
        }
      `}</style>
    </div>
  );
}
