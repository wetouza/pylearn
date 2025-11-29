"use client";

import { useEffect, useState, useCallback } from "react";

// Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_CODE = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "KeyB", "KeyA"
];

interface EasterEggState {
  konamiActivated: boolean;
  secretMode: boolean;
}

export function useEasterEggs() {
  const [state, setState] = useState<EasterEggState>({
    konamiActivated: false,
    secretMode: false,
  });
  const [konamiIndex, setKonamiIndex] = useState(0);

  // Konami code detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const expectedKey = KONAMI_CODE[konamiIndex];
      
      if (e.code === expectedKey) {
        const newIndex = konamiIndex + 1;
        setKonamiIndex(newIndex);
        
        if (newIndex === KONAMI_CODE.length) {
          // Konami code completed!
          setState(prev => ({ ...prev, konamiActivated: true }));
          setKonamiIndex(0);
          
          // Trigger celebration
          triggerCelebration();
        }
      } else {
        setKonamiIndex(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [konamiIndex]);

  // Secret word detection (type "python" anywhere)
  useEffect(() => {
    let buffer = "";
    const secretWord = "python";
    
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      buffer += e.key.toLowerCase();
      
      // Keep only last N characters
      if (buffer.length > secretWord.length) {
        buffer = buffer.slice(-secretWord.length);
      }
      
      if (buffer === secretWord) {
        setState(prev => ({ ...prev, secretMode: !prev.secretMode }));
        buffer = "";
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, []);

  const resetEasterEggs = useCallback(() => {
    setState({ konamiActivated: false, secretMode: false });
  }, []);

  return { ...state, resetEasterEggs };
}

// Celebration effect
function triggerCelebration() {
  // Create confetti
  const colors = ["#ff0", "#f0f", "#0ff", "#0f0", "#f00", "#00f"];
  const confettiCount = 150;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -10px;
      opacity: 1;
      pointer-events: none;
      z-index: 9999;
      border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
      animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
      animation-delay: ${Math.random() * 0.5}s;
    `;
    document.body.appendChild(confetti);
    
    // Remove after animation
    setTimeout(() => confetti.remove(), 4500);
  }

  // Add animation styles if not exists
  if (!document.getElementById("confetti-styles")) {
    const style = document.createElement("style");
    style.id = "confetti-styles";
    style.textContent = `
      @keyframes confetti-fall {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Play sound effect (optional, using Web Audio API)
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.3); // C6
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch {
    // Audio not supported, ignore
  }
}

// Snake emoji that follows cursor (for secret mode)
export function useSnakeCursor(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const snake = document.createElement("div");
    snake.innerHTML = "🐍";
    snake.style.cssText = `
      position: fixed;
      font-size: 24px;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.1s ease-out;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(snake);

    const handleMouseMove = (e: MouseEvent) => {
      snake.style.left = `${e.clientX + 20}px`;
      snake.style.top = `${e.clientY + 20}px`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      snake.remove();
    };
  }, [enabled]);
}
