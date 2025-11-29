"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Copy, Check, X, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Achievement, rarityColors } from "@/data/achievements";
import { useToast } from "./toast";

interface ShareAchievementProps {
  achievement: Achievement;
  onClose: () => void;
}

export function ShareAchievementModal({ achievement, onClose }: ShareAchievementProps) {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const shareText = `🏆 Я получил достижение "${achievement.title}" на PyLearn!\n\n${achievement.icon} ${achievement.description}\n\nИзучай Python бесплатно: https://pylearn.ru`;

  const shareLinks = [
    {
      name: "Telegram",
      icon: "📱",
      url: `https://t.me/share/url?url=${encodeURIComponent("https://pylearn.ru")}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "VK",
      icon: "💬",
      url: `https://vk.com/share.php?url=${encodeURIComponent("https://pylearn.ru")}&title=${encodeURIComponent(shareText)}`,
    },
    {
      name: "Twitter",
      icon: "🐦",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    },
  ];

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      addToast({
        type: "success",
        title: "Скопировано!",
        description: "Текст скопирован в буфер обмена",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      addToast({
        type: "error",
        title: "Ошибка",
        description: "Не удалось скопировать",
      });
    }
  }, [shareText, addToast]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm"
        >
          <div
            className="rounded-xl shadow-2xl overflow-hidden"
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            {/* Header */}
            <div
              className="relative p-6 text-center"
              style={{
                background: `linear-gradient(135deg, ${rarityColors[achievement.rarity]}20, transparent)`,
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              <div className="text-5xl mb-3">{achievement.icon}</div>
              <h3 className="text-lg font-bold mb-1">{achievement.title}</h3>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
              
              <div
                className="inline-block mt-3 px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${rarityColors[achievement.rarity]}20`,
                  color: rarityColors[achievement.rarity],
                }}
              >
                {achievement.rarity === "common" && "Обычное"}
                {achievement.rarity === "rare" && "Редкое"}
                {achievement.rarity === "epic" && "Эпическое"}
                {achievement.rarity === "legendary" && "Легендарное"}
              </div>
            </div>

            {/* Share options */}
            <div className="p-4 space-y-2">
              <div className="text-xs text-muted-foreground mb-2">
                Поделиться достижением
              </div>

              <div className="grid grid-cols-3 gap-2">
                {shareLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 p-3 rounded-xl text-sm hover:bg-white/10 transition-colors"
                    style={{ backgroundColor: "hsl(var(--muted) / 0.5)" }}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="text-xs">{link.name}</span>
                  </a>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full gap-2 mt-2"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Скопировано!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Копировать текст
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
