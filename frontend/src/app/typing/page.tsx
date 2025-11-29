"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RotateCcw, 
  Timer, 
  Target, 
  Zap, 
  Trophy,
  Keyboard,
  TrendingUp,
  History,
  X,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useProgress, TypingStats } from "@/hooks/useProgress";
import { useAchievementNotification } from "@/hooks/useAchievementNotification";

// Слова для практики
const wordLists = {
  common: [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
    "for", "not", "on", "with", "as", "you", "do", "at", "this", "but",
    "by", "from", "they", "we", "say", "or", "an", "will", "my", "one",
    "all", "would", "there", "their", "what", "so", "up", "out", "if", "about",
    "who", "get", "which", "go", "me", "when", "make", "can", "like", "time"
  ],
  programming: [
    "function", "variable", "const", "let", "return", "import", "export", "class",
    "interface", "type", "string", "number", "boolean", "array", "object", "null",
    "async", "await", "promise", "callback", "loop", "while", "for", "if", "else",
    "switch", "case", "break", "continue", "try", "catch", "throw", "new", "this",
    "static", "void", "int", "float", "double", "char", "bool", "true", "false"
  ],
  python: [
    "print", "input", "range", "len", "list", "dict", "tuple", "set", "str", "int",
    "float", "bool", "None", "True", "False", "def", "class", "self", "return", "if",
    "elif", "else", "for", "while", "break", "continue", "pass", "import", "from", "as",
    "try", "except", "finally", "raise", "with", "open", "lambda", "map", "filter", "zip"
  ],
};

type WordMode = keyof typeof wordLists;
type TimeMode = 15 | 30 | 60;

interface Stats {
  wpm: number;
  accuracy: number;
  correct: number;
  incorrect: number;
}

export default function TypingPage() {
  const [mode, setMode] = useState<WordMode>("common");
  const [timeMode, setTimeMode] = useState<TimeMode>(30);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [input, setInput] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(timeMode);
  const [typedWords, setTypedWords] = useState<{word: string; correct: boolean}[]>([]);
  const [stats, setStats] = useState<Stats>({ wpm: 0, accuracy: 100, correct: 0, incorrect: 0 });
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { progress, saveTypingStats, averageWpm } = useProgress();
  
  // Enable achievement notifications
  useAchievementNotification();

  // Generate words for typing
  const generateWords = useCallback(() => {
    const list = wordLists[mode];
    const result: string[] = [];
    for (let i = 0; i < 100; i++) {
      result.push(list[Math.floor(Math.random() * list.length)]);
    }
    return result;
  }, [mode]);

  // Инициализация
  useEffect(() => {
    setWords(generateWords());
  }, [generateWords]);

  // Timer
  useEffect(() => {
    if (!isStarted || isFinished) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStarted, isFinished]);

  // Сохранение результатов при завершении
  useEffect(() => {
    if (isFinished && stats.wpm > 0) {
      saveTypingStats({
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        mode,
        duration: timeMode,
      });
    }
  }, [isFinished, stats.wpm, stats.accuracy, mode, timeMode, saveTypingStats]);

  // Обновление WPM в реальном времени
  useEffect(() => {
    if (!isStarted || isFinished || !startTimeRef.current) return;
    
    const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
    const correctWords = typedWords.filter(w => w.correct).length;
    const totalWords = typedWords.length;
    const wpm = elapsed > 0 ? Math.round(correctWords / elapsed) : 0;
    const accuracy = totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 100;
    
    setStats(prev => ({ ...prev, wpm, accuracy, correct: correctWords, incorrect: totalWords - correctWords }));
  }, [typedWords, isStarted, isFinished]);

  // Обработка ввода
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!isStarted && value.length > 0) {
      setIsStarted(true);
      startTimeRef.current = Date.now();
    }

    if (isFinished) return;

    const currentWord = words[currentWordIndex];
    
    // Проверка пробела (переход к следующему слову)
    if (value.endsWith(" ")) {
      const typedWord = value.trim();
      const isCorrect = typedWord === currentWord;
      
      setTypedWords(prev => [...prev, { word: typedWord, correct: isCorrect }]);
      setCurrentWordIndex(prev => prev + 1);
      setInput("");
      return;
    }

    setInput(value);
  };

  // Обработка клавиш
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      reset();
    }
  };

  // Сброс
  const reset = useCallback(() => {
    setWords(generateWords());
    setCurrentWordIndex(0);
    setInput("");
    setIsStarted(false);
    setIsFinished(false);
    setTimeLeft(timeMode);
    setTypedWords([]);
    setStats({ wpm: 0, accuracy: 100, correct: 0, incorrect: 0 });
    startTimeRef.current = null;
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [generateWords, timeMode]);

  // Смена режима времени
  const changeTimeMode = (time: TimeMode) => {
    setTimeMode(time);
    setTimeLeft(time);
    reset();
  };

  // Фокус на input
  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Получить класс для символа
  const getCharClass = (wordIdx: number, charIdx: number, char: string) => {
    if (wordIdx < currentWordIndex) {
      // Уже напечатанное слово
      const typed = typedWords[wordIdx];
      if (!typed) return "text-muted-foreground/40";
      if (typed.correct) return "text-green-500/70";
      return "text-red-500/70";
    }
    
    if (wordIdx === currentWordIndex) {
      // Текущее слово
      if (charIdx < input.length) {
        return input[charIdx] === char ? "text-green-500" : "text-red-500 bg-red-500/20";
      }
      if (charIdx === input.length) {
        return "border-b-2 border-primary";
      }
      return "text-muted-foreground";
    }
    
    // Будущие слова
    return "text-muted-foreground/60";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4"
              style={{ background: "hsl(var(--primary) / 0.1)" }}
            >
              <Keyboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: "hsl(var(--primary))" }} />
              <span className="text-xs sm:text-sm font-medium" style={{ color: "hsl(var(--primary))" }}>Typing Trainer</span>
            </motion.div>
            
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
              Учись печатать <span className="gradient-text">вслепую</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Развивай скорость и точность. Нажми Tab для сброса.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            {/* Word mode */}
            <div className="flex items-center gap-0.5 sm:gap-1 p-1 rounded-lg" style={{ background: "hsl(var(--muted))" }}>
              {(Object.keys(wordLists) as WordMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); reset(); }}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all"
                  style={{ 
                    background: mode === m ? "hsl(var(--background))" : "transparent",
                    color: mode === m ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                    boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                  }}
                >
                  {m === "common" ? "Общие" : m === "programming" ? "Код" : "Python"}
                </button>
              ))}
            </div>

            {/* Time mode */}
            <div className="flex items-center gap-0.5 sm:gap-1 p-1 rounded-lg" style={{ background: "hsl(var(--muted))" }}>
              {([15, 30, 60] as TimeMode[]).map((t) => (
                <button
                  key={t}
                  onClick={() => changeTimeMode(t)}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all"
                  style={{ 
                    background: timeMode === t ? "hsl(var(--background))" : "transparent",
                    color: timeMode === t ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                    boxShadow: timeMode === t ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                  }}
                >
                  {t}с
                </button>
              ))}
            </div>

            {/* History button */}
            {progress.typingStats.length > 0 && (
              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all hover:bg-white/10"
                style={{ background: "hsl(var(--muted))" }}
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">История</span>
                <span className="text-muted-foreground">({progress.typingStats.length})</span>
              </button>
            )}
          </div>

          {/* Stats bar */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6 sm:mb-8">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Timer className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "hsl(var(--primary))" }} />
              <span className="text-xl sm:text-2xl font-mono font-bold">{timeLeft}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">сек</span>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              <span className="text-xl sm:text-2xl font-mono font-bold">{stats.wpm}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">WPM</span>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              <span className="text-xl sm:text-2xl font-mono font-bold">{stats.accuracy}%</span>
            </div>
          </div>

          {/* Typing area */}
          <div 
            ref={containerRef}
            className="relative glass-card p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl cursor-text min-h-[150px] sm:min-h-[200px]"
            onClick={focusInput}
          >
            {/* Hidden input */}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              className="absolute opacity-0 pointer-events-none"
              autoFocus
              disabled={isFinished}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />

            {/* Words display */}
            <div className="font-mono text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-loose select-none overflow-hidden">
              {words.slice(0, 40).map((word, wordIdx) => (
                <span 
                  key={wordIdx} 
                  className={`inline-block mr-2 sm:mr-3 mb-1 sm:mb-2 ${
                    wordIdx === currentWordIndex ? "bg-primary/10 rounded px-0.5" : ""
                  }`}
                >
                  {word.split("").map((char, charIdx) => (
                    <span 
                      key={charIdx} 
                      className={`transition-colors duration-75 ${getCharClass(wordIdx, charIdx, char)}`}
                    >
                      {char}
                    </span>
                  ))}
                  {/* Показать лишние символы */}
                  {wordIdx === currentWordIndex && input.length > word.length && (
                    <span className="text-red-500 bg-red-500/20">
                      {input.slice(word.length)}
                    </span>
                  )}
                </span>
              ))}
            </div>

            {/* Start prompt */}
            {!isStarted && !isFinished && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center rounded-xl sm:rounded-2xl"
                style={{ background: "hsl(var(--background) / 0.8)", backdropFilter: "blur(4px)" }}
              >
                <div className="text-center px-4">
                  <Keyboard className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 animate-pulse" style={{ color: "hsl(var(--primary))" }} />
                  <p className="text-base sm:text-xl font-medium">Начни печатать...</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Таймер запустится автоматически</p>
                </div>
              </motion.div>
            )}

            {/* Results overlay */}
            <AnimatePresence>
              {isFinished && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center rounded-xl sm:rounded-2xl"
                  style={{ background: "hsl(var(--background) / 0.95)", backdropFilter: "blur(8px)" }}
                >
                  <div className="text-center px-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                    >
                      <Trophy className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-yellow-500" />
                    </motion.div>
                    
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Результаты</h2>
                    
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                      <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-mono font-bold" style={{ color: "hsl(var(--primary))" }}>{stats.wpm}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">слов/мин</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-mono font-bold text-green-500">{stats.accuracy}%</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">точность</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-mono font-bold">{stats.correct}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">правильных</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-mono font-bold text-red-500">{stats.incorrect}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">ошибок</div>
                      </div>
                    </div>

                    <Button onClick={reset} variant="glow" className="gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Ещё раз
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reset hint */}
          <div className="flex justify-center mt-4 sm:mt-6">
            <Button variant="ghost" size="sm" onClick={reset} className="gap-2 text-xs sm:text-sm">
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Сбросить (Tab)
            </Button>
          </div>

          {/* Tips */}
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-12">
            {[
              {
                icon: Keyboard,
                title: "Позиция рук",
                desc: "ASDF для левой, JKL; для правой руки",
                color: "hsl(var(--primary))"
              },
              {
                icon: Target,
                title: "Точность > Скорость",
                desc: "Сначала точность, скорость придёт",
                color: "hsl(145 60% 45%)"
              },
              {
                icon: TrendingUp,
                title: "Практика",
                desc: "15-20 минут в день для прогресса",
                color: "hsl(45 90% 50%)"
              }
            ].map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="glass-card p-4 sm:p-6 rounded-xl"
              >
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-3 sm:mb-4"
                  style={{ background: `${tip.color}20` }}
                >
                  <tip.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: tip.color }} />
                </div>
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">{tip.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{tip.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4"
            >
              <div
                className="rounded-xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
                    <h2 className="font-semibold">История результатов</h2>
                  </div>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Stats summary */}
                <div className="p-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold" style={{ color: "hsl(var(--primary))" }}>
                        {averageWpm}
                      </div>
                      <div className="text-xs text-muted-foreground">Средний WPM</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">
                        {progress.typingStats.length > 0
                          ? Math.round(
                              progress.typingStats.reduce((a, b) => a + b.accuracy, 0) /
                                progress.typingStats.length
                            )
                          : 0}%
                      </div>
                      <div className="text-xs text-muted-foreground">Средняя точность</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {progress.typingStats.length > 0
                          ? Math.max(...progress.typingStats.map((s) => s.wpm))
                          : 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Лучший WPM</div>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                {progress.typingStats.length > 1 && (
                  <div className="p-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                    <div className="text-xs text-muted-foreground mb-2">Прогресс WPM</div>
                    <div className="h-24 flex items-end gap-1">
                      {progress.typingStats.slice(-20).map((stat, i) => {
                        const maxWpm = Math.max(...progress.typingStats.map((s) => s.wpm));
                        const height = maxWpm > 0 ? (stat.wpm / maxWpm) * 100 : 0;
                        return (
                          <div
                            key={i}
                            className="flex-1 rounded-t transition-all hover:opacity-80"
                            style={{
                              height: `${height}%`,
                              minHeight: "4px",
                              background: `linear-gradient(to top, hsl(var(--gradient-start)), hsl(var(--gradient-end)))`,
                            }}
                            title={`${stat.wpm} WPM`}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* History list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {progress.typingStats
                    .slice()
                    .reverse()
                    .slice(0, 20)
                    .map((stat, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ background: "hsl(var(--muted))" }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-lg font-bold" style={{ color: "hsl(var(--primary))" }}>
                            {stat.wpm}
                          </div>
                          <div className="text-xs text-muted-foreground">WPM</div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-green-500">{stat.accuracy}%</span>
                          <span className="text-muted-foreground">{stat.duration}с</span>
                          <span className="text-muted-foreground text-xs">
                            {new Date(stat.date).toLocaleDateString("ru-RU")}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
