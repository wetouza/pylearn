"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Shield,
  AlertTriangle,
  ExternalLink,
  HardDrive,
  Globe,
  Lock,
  Server,
  Star,
  Zap,
  Search,
  Gamepad2,
  Film,
  BookOpen,
  Music,
  Monitor,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const categories = [
  { id: "all", name: "Всё", icon: Globe },
  { id: "games", name: "Игры", icon: Gamepad2 },
  { id: "movies", name: "Фильмы", icon: Film },
  { id: "books", name: "Книги", icon: BookOpen },
  { id: "software", name: "Софт", icon: Monitor },
  { id: "vpn", name: "VPN", icon: Lock },
  { id: "tools", name: "Утилиты", icon: Zap },
];

// Торрент клиенты
const torrentClients = [
  {
    name: "qBittorrent",
    desc: "Лучший клиент. Открытый код, без рекламы.",
    url: "https://www.qbittorrent.org/",
    recommended: true,
    platform: "Win/Mac/Linux",
  },
  {
    name: "Transmission",
    desc: "Лёгкий и минималистичный.",
    url: "https://transmissionbt.com/",
    platform: "Mac/Linux",
  },
  {
    name: "LibreTorrent",
    desc: "Для Android без рекламы.",
    url: "https://github.com/proninyaroslav/libretorrent",
    platform: "Android",
  },
];

// Игры
const gamesSites = [
  { name: "FitGirl Repacks", url: "https://fitgirl-repacks.site", desc: "Сжатые репаки игр", hot: true },
  { name: "DODI Repacks", url: "https://dodi-repacks.site", desc: "Быстрые репаки" },
  { name: "RuTracker", url: "https://rutracker.org", desc: "Крупнейший трекер", hot: true },
  { name: "Online-Fix", url: "https://online-fix.me", desc: "Онлайн в пиратках" },
  { name: "GOG Games", url: "https://gog-games.to", desc: "DRM-free игры" },
  { name: "SteamRIP", url: "https://steamrip.com", desc: "Предустановленные игры" },
];

// Фильмы и сериалы
const moviesSites = [
  { name: "HDRezka", url: "https://hdrezka.ag", desc: "Онлайн просмотр", hot: true },
  { name: "Kinozal", url: "https://kinozal.tv", desc: "Торренты в качестве" },
  { name: "RuTracker", url: "https://rutracker.org", desc: "Раздачи в 4K/Remux" },
  { name: "AniLibria", url: "https://anilibria.tv", desc: "Аниме с озвучкой", hot: true },
  { name: "Shikimori", url: "https://shikimori.one", desc: "Каталог аниме" },
];

// Книги и курсы
const booksSites = [
  { name: "Library Genesis", url: "https://libgen.is", desc: "Научная литература", hot: true },
  { name: "Anna's Archive", url: "https://annas-archive.org", desc: "Поиск по всем библиотекам", hot: true },
  { name: "Flibusta", url: "https://flibusta.is", desc: "Художественная литература" },
  { name: "Coursehunter", url: "https://coursehunter.net", desc: "IT-курсы", hot: true },
  { name: "RuTracker", url: "https://rutracker.org", desc: "Аудиокниги, курсы" },
];

// Софт
const softwareSites = [
  { name: "MAS", url: "https://github.com/massgravel/Microsoft-Activation-Scripts", desc: "Активация Windows/Office", hot: true },
  { name: "LRepacks", url: "https://lrepacks.net", desc: "Портативный софт" },
  { name: "CRACKSurl", url: "https://cracksurl.com", desc: "Кряки для софта" },
  { name: "RuTracker", url: "https://rutracker.org", desc: "Любой софт" },
];

// VPN
const vpnServices = [
  {
    name: "Amnezia VPN",
    desc: "Обходит блокировки РКН. Нужен свой сервер.",
    url: "https://amnezia.org",
    recommended: true,
    price: "Бесплатно",
  },
  {
    name: "Outline VPN",
    desc: "От Google. Простая настройка.",
    url: "https://getoutline.org",
    recommended: true,
    price: "Бесплатно",
  },
  {
    name: "Mullvad VPN",
    desc: "Анонимный, без логов.",
    url: "https://mullvad.net",
    price: "€5/мес",
  },
  {
    name: "Proton VPN",
    desc: "Швейцарский, есть бесплатный план.",
    url: "https://protonvpn.com",
    price: "от $0",
  },
];

// Хостинги для VPN
const hostings = [
  { name: "Oracle Cloud", url: "https://cloud.oracle.com", desc: "Бесплатный VPS навсегда!", hot: true, price: "Бесплатно" },
  { name: "Aéza", url: "https://aeza.net", desc: "Дешёвые VPS в Европе", price: "от 3€" },
  { name: "Timeweb", url: "https://timeweb.cloud", desc: "Российский, хорошая поддержка", price: "от 199₽" },
];

// Утилиты
const tools = [
  { name: "uBlock Origin", url: "https://ublockorigin.com", desc: "Лучший блокировщик рекламы", hot: true },
  { name: "SponsorBlock", url: "https://sponsor.ajay.app", desc: "Пропуск рекламы в YouTube" },
  { name: "yt-dlp", url: "https://github.com/yt-dlp/yt-dlp", desc: "Скачивание видео", hot: true },
  { name: "Cobalt", url: "https://cobalt.tools", desc: "Скачивание видео онлайн" },
  { name: "VirusTotal", url: "https://virustotal.com", desc: "Проверка файлов", hot: true },
  { name: "12ft.io", url: "https://12ft.io", desc: "Обход paywall статей" },
];

const safetyTips = [
  "Используй VPN при скачивании торрентов",
  "Проверяй файлы на VirusTotal перед запуском",
  "Смотри на количество сидеров и комментарии",
  "Используй qBittorrent — он без рекламы",
  "Не вводи данные карты на пиратских сайтах",
];

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Фильтрация по поиску
  const filterBySearch = <T extends { name: string; desc: string }>(items: T[]) => {
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) => item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
    );
  };

  const showSection = (category: string) => {
    return activeCategory === "all" || activeCategory === category;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="container max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3"
              style={{ background: "hsl(var(--primary) / 0.1)" }}
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: "hsl(var(--primary))" }} />
              <span className="text-xs sm:text-sm font-medium" style={{ color: "hsl(var(--primary))" }}>
                Полезные ресурсы
              </span>
            </motion.div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3">
              Пиратский <span className="gradient-text">гайд</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Проверенные сайты для скачивания игр, фильмов, книг и софта
            </p>
          </div>

          {/* Warning */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 sm:p-4 rounded-xl mb-6 flex items-start gap-3"
            style={{ background: "hsl(45 90% 50% / 0.08)", border: "1px solid hsl(45 90% 50% / 0.2)" }}
          >
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" style={{ color: "hsl(45 90% 50%)" }} />
            <p className="text-xs sm:text-sm text-muted-foreground">
              Информация в образовательных целях. Если продукт понравился — поддержи разработчиков покупкой.
            </p>
          </motion.div>

          {/* Search + Categories */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-shrink-0 sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full text-sm bg-transparent outline-none"
                style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all"
                    style={{
                      background: isActive ? "hsl(var(--primary))" : "hsl(var(--muted))",
                      color: isActive ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Torrent Clients - Always show */}
          {activeCategory === "all" && (
            <Section title="Торрент-клиенты" icon={HardDrive} color="hsl(var(--primary))">
              <div className="grid sm:grid-cols-3 gap-3">
                {torrentClients.map((client) => (
                  <ResourceCard
                    key={client.name}
                    name={client.name}
                    desc={client.desc}
                    url={client.url}
                    badge={client.platform}
                    recommended={client.recommended}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Games */}
          {showSection("games") && (
            <Section title="Игры" icon={Gamepad2} color="hsl(280 80% 60%)">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {filterBySearch(gamesSites).map((site) => (
                  <SiteCard key={site.name} {...site} />
                ))}
              </div>
            </Section>
          )}

          {/* Movies */}
          {showSection("movies") && (
            <Section title="Фильмы и сериалы" icon={Film} color="hsl(0 70% 50%)">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {filterBySearch(moviesSites).map((site) => (
                  <SiteCard key={site.name} {...site} />
                ))}
              </div>
            </Section>
          )}

          {/* Books */}
          {showSection("books") && (
            <Section title="Книги и курсы" icon={BookOpen} color="hsl(145 60% 45%)">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {filterBySearch(booksSites).map((site) => (
                  <SiteCard key={site.name} {...site} />
                ))}
              </div>
            </Section>
          )}

          {/* Software */}
          {showSection("software") && (
            <Section title="Софт и активация" icon={Monitor} color="hsl(200 80% 50%)">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {filterBySearch(softwareSites).map((site) => (
                  <SiteCard key={site.name} {...site} />
                ))}
              </div>
            </Section>
          )}

          {/* VPN */}
          {showSection("vpn") && (
            <Section title="VPN для России" icon={Lock} color="hsl(145 60% 45%)">
              <p className="text-xs text-muted-foreground mb-4">
                Для Amnezia/Outline нужен свой VPS. Рекомендуем Oracle Cloud (бесплатно).
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {vpnServices.map((vpn) => (
                  <ResourceCard
                    key={vpn.name}
                    name={vpn.name}
                    desc={vpn.desc}
                    url={vpn.url}
                    badge={vpn.price}
                    recommended={vpn.recommended}
                  />
                ))}
              </div>

              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Server className="w-4 h-4" />
                Хостинги для своего VPN
              </h4>
              <div className="grid sm:grid-cols-3 gap-3">
                {hostings.map((host) => (
                  <ResourceCard
                    key={host.name}
                    name={host.name}
                    desc={host.desc}
                    url={host.url}
                    badge={host.price}
                    recommended={host.hot}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Tools */}
          {showSection("tools") && (
            <Section title="Полезные утилиты" icon={Zap} color="hsl(45 90% 50%)">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {filterBySearch(tools).map((tool) => (
                  <SiteCard key={tool.name} {...tool} />
                ))}
              </div>
            </Section>
          )}

          {/* Safety Tips */}
          <div
            className="mt-10 p-4 sm:p-6 rounded-xl"
            style={{ background: "hsl(145 60% 45% / 0.08)", border: "1px solid hsl(145 60% 45% / 0.2)" }}
          >
            <h3 className="font-semibold text-sm sm:text-base mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" style={{ color: "hsl(145 60% 45%)" }} />
              Правила безопасности
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {safetyTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                  <span style={{ color: "hsl(145 60% 45%)" }}>✓</span>
                  <span className="text-muted-foreground">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

// Section component
function Section({
  title,
  icon: Icon,
  color,
  children,
}: {
  title: string;
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5" style={{ color }} />
        {title}
      </h2>
      {children}
    </section>
  );
}

// Site card for trackers
function SiteCard({ name, url, desc, hot }: { name: string; url: string; desc: string; hot?: boolean }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative p-3 rounded-xl hover:scale-[1.02] transition-transform"
      style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
    >
      {hot && (
        <Star
          className="absolute top-2 right-2 w-3.5 h-3.5"
          style={{ color: "hsl(45 90% 50%)" }}
          fill="hsl(45 90% 50%)"
        />
      )}
      <div className="font-medium text-sm truncate pr-5">{name}</div>
      <div className="text-[11px] text-muted-foreground truncate">{desc}</div>
    </a>
  );
}

// Resource card for clients/vpn
function ResourceCard({
  name,
  desc,
  url,
  badge,
  recommended,
}: {
  name: string;
  desc: string;
  url: string;
  badge?: string;
  recommended?: boolean;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative p-4 rounded-xl hover:scale-[1.02] transition-transform"
      style={{
        background: "hsl(var(--card))",
        border: recommended ? "1px solid hsl(145 60% 45% / 0.3)" : "1px solid hsl(var(--border))",
      }}
    >
      {recommended && (
        <Star
          className="absolute top-3 right-3 w-4 h-4"
          style={{ color: "hsl(145 60% 45%)" }}
          fill="hsl(145 60% 45%)"
        />
      )}
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-sm">{name}</span>
        {badge && (
          <span
            className="text-[10px] px-2 py-0.5 rounded"
            style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
          >
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </a>
  );
}
