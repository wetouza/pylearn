"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Play, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language?: string;
  output?: string;
  showLineNumbers?: boolean;
  filename?: string;
}

export function CodeBlock({
  code,
  language = "python",
  output,
  showLineNumbers = false,
  filename,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const lines = code.split("\n");

  return (
    <div className="relative group my-4">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2 rounded-t-xl border-b"
        style={{
          background: "hsl(var(--muted))",
          borderColor: "hsl(var(--border))",
        }}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-mono">
            {filename || language}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {output && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOutput(!showOutput)}
              className="h-7 px-2 text-xs gap-1"
            >
              <Play className="w-3 h-3" />
              {showOutput ? "Скрыть" : "Вывод"}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-7 px-2 text-xs gap-1"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1"
                >
                  <Check className="w-3 h-3 text-green-500" />
                  <span className="text-green-500">Скопировано</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Копировать</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Code */}
      <div
        className="overflow-x-auto rounded-b-xl"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderTop: "none",
        }}
      >
        <pre className="p-4 text-sm font-mono">
          <code>
            {showLineNumbers ? (
              <table className="border-collapse">
                <tbody>
                  {lines.map((line, i) => (
                    <tr key={i}>
                      <td className="pr-4 text-muted-foreground/50 select-none text-right w-8">
                        {i + 1}
                      </td>
                      <td>
                        <CodeLine line={line} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              lines.map((line, i) => (
                <div key={i}>
                  <CodeLine line={line} />
                </div>
              ))
            )}
          </code>
        </pre>
      </div>

      {/* Output */}
      <AnimatePresence>
        {output && showOutput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div
              className="mt-2 p-4 rounded-xl text-sm font-mono"
              style={{
                background: "hsl(var(--muted))",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                <Play className="w-3 h-3" />
                Вывод:
              </div>
              <div className="text-green-500 whitespace-pre-wrap">{output}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple syntax highlighting for Python
function CodeLine({ line }: { line: string }) {
  // Keywords
  const keywords = /\b(def|class|if|elif|else|for|while|try|except|finally|with|as|import|from|return|yield|raise|break|continue|pass|lambda|and|or|not|in|is|True|False|None|async|await|global|nonlocal)\b/g;
  
  // Strings
  const strings = /(["'])(?:(?=(\\?))\2.)*?\1|f["'](?:(?=(\\?))\3.)*?["']/g;
  
  // Comments
  const comments = /#.*/g;
  
  // Numbers
  const numbers = /\b\d+\.?\d*\b/g;
  
  // Functions
  const functions = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;

  let result = line;
  
  // Order matters: comments last to override others
  result = result.replace(strings, '<span class="syntax-string">$&</span>');
  result = result.replace(keywords, '<span class="syntax-keyword">$&</span>');
  result = result.replace(numbers, '<span class="syntax-number">$&</span>');
  result = result.replace(functions, '<span class="syntax-function">$1</span>(');
  result = result.replace(comments, '<span class="syntax-comment">$&</span>');

  return <span dangerouslySetInnerHTML={{ __html: result || "&nbsp;" }} />;
}
