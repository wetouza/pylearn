import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { PageTransitionProvider } from "@/components/providers/page-transition-provider";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/shared/toast";
import { EasterEggsProvider } from "@/components/shared/easter-eggs-provider";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geist-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "PyLearn — Изучай Python с нуля",
  description:
    "Современная образовательная платформа для изучения Python. Пошаговые гайды, интерактивные упражнения и система отслеживания прогресса для полных новичков.",
  keywords: [
    "Python",
    "программирование",
    "обучение",
    "курсы",
    "для начинающих",
    "уроки",
    "VS Code",
  ],
  authors: [{ name: "PyLearn Team" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "PyLearn — Изучай Python с нуля",
    description:
      "Современная образовательная платформа для изучения Python для полных новичков.",
    type: "website",
    locale: "ru_RU",
    siteName: "PyLearn",
  },
  twitter: {
    card: "summary_large_image",
    title: "PyLearn — Изучай Python с нуля",
    description: "Современная образовательная платформа для изучения Python",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <EasterEggsProvider>
              <SmoothScrollProvider>
                <div className="relative flex min-h-screen flex-col">
                  <PageTransitionProvider>
                    {children}
                  </PageTransitionProvider>
                </div>
                <Toaster />
                <ScrollToTop />
              </SmoothScrollProvider>
            </EasterEggsProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
