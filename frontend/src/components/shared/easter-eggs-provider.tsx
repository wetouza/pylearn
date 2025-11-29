"use client";

import { useEffect } from "react";
import { useEasterEggs, useSnakeCursor } from "@/hooks/useEasterEggs";
import { useToast } from "./toast";

export function EasterEggsProvider({ children }: { children: React.ReactNode }) {
  const { konamiActivated, secretMode } = useEasterEggs();
  const { addToast } = useToast();

  // Snake cursor in secret mode
  useSnakeCursor(secretMode);

  // Show toast when Konami code is activated
  useEffect(() => {
    if (konamiActivated) {
      addToast({
        type: "achievement",
        title: "🎮 Konami Code!",
        description: "Ты нашёл секрет! +100 к уважению",
        icon: "🕹️",
        duration: 5000,
      });
    }
  }, [konamiActivated, addToast]);

  // Show toast when secret mode is toggled
  useEffect(() => {
    if (secretMode) {
      addToast({
        type: "info",
        title: "🐍 Secret Mode!",
        description: "Напиши 'python' ещё раз чтобы выключить",
        duration: 3000,
      });
    }
  }, [secretMode, addToast]);

  return <>{children}</>;
}
