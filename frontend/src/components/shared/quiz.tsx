"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  onComplete?: (score: number) => void;
}

export function Quiz({ questions, onComplete }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctIndex;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = useCallback((index: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    if (index === currentQuestion.correctIndex) {
      setCorrectCount((prev) => prev + 1);
    }
  }, [isAnswered, currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsComplete(true);
      const score = Math.round(((correctCount + (isCorrect ? 1 : 0)) / questions.length) * 100);
      onComplete?.(score);
    }
  }, [currentIndex, questions.length, correctCount, isCorrect, onComplete]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setIsComplete(false);
  }, []);

  if (isComplete) {
    const finalScore = Math.round((correctCount / questions.length) * 100);
    const isPerfect = finalScore === 100;
    const isGood = finalScore >= 70;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 sm:p-8 rounded-xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
        >
          <Trophy
            className="w-16 h-16 mx-auto mb-4"
            style={{
              color: isPerfect
                ? "hsl(45 90% 50%)"
                : isGood
                ? "hsl(145 60% 45%)"
                : "hsl(var(--muted-foreground))",
            }}
          />
        </motion.div>

        <h3 className="text-2xl font-bold mb-2">
          {isPerfect ? "Отлично! 🎉" : isGood ? "Хорошо!" : "Попробуй ещё раз"}
        </h3>
        
        <p className="text-muted-foreground mb-6">
          Ты ответил правильно на {correctCount} из {questions.length} вопросов
        </p>

        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <div
              className="text-4xl font-bold"
              style={{
                color: isPerfect
                  ? "hsl(45 90% 50%)"
                  : isGood
                  ? "hsl(145 60% 45%)"
                  : "hsl(var(--foreground))",
              }}
            >
              {finalScore}%
            </div>
            <div className="text-sm text-muted-foreground">Результат</div>
          </div>
        </div>

        <Button onClick={handleRestart} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Пройти заново
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            Вопрос {currentIndex + 1} из {questions.length}
          </span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: "hsl(var(--muted))" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background:
                "linear-gradient(to right, hsl(var(--gradient-start)), hsl(var(--gradient-end)))",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>

          {/* Options */}
          <div className="space-y-2 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === currentQuestion.correctIndex;
              
              let bgColor = "hsl(var(--muted))";
              let borderColor = "hsl(var(--border))";
              
              if (isAnswered) {
                if (isCorrectOption) {
                  bgColor = "hsl(145 60% 45% / 0.15)";
                  borderColor = "hsl(145 60% 45% / 0.5)";
                } else if (isSelected && !isCorrectOption) {
                  bgColor = "hsl(0 70% 50% / 0.15)";
                  borderColor = "hsl(0 70% 50% / 0.5)";
                }
              } else if (isSelected) {
                bgColor = "hsl(var(--primary) / 0.15)";
                borderColor = "hsl(var(--primary) / 0.5)";
              }

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                  className="w-full p-4 rounded-xl text-left transition-colors flex items-center gap-3"
                  style={{
                    background: bgColor,
                    border: `1px solid ${borderColor}`,
                  }}
                  whileHover={!isAnswered ? { scale: 1.01 } : {}}
                  whileTap={!isAnswered ? { scale: 0.99 } : {}}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                    style={{
                      background: isSelected ? "hsl(var(--primary))" : "hsl(var(--background))",
                      color: isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
                    }}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1">{option}</span>
                  {isAnswered && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {isAnswered && currentQuestion.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-xl"
                style={{
                  background: isCorrect
                    ? "hsl(145 60% 45% / 0.1)"
                    : "hsl(45 90% 50% / 0.1)",
                  border: `1px solid ${
                    isCorrect ? "hsl(145 60% 45% / 0.2)" : "hsl(45 90% 50% / 0.2)"
                  }`,
                }}
              >
                <p className="text-sm text-muted-foreground">
                  {currentQuestion.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <Button onClick={handleNext} variant="glow" className="gap-2">
                {currentIndex < questions.length - 1 ? "Следующий" : "Завершить"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
