"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Download, 
  Shield, 
  AlertTriangle, 
  ExternalLink,
  Monitor,
  Film,
  Music,
  BookOpen,
  HardDrive,
  Globe,
  Lock,
  MessageCircle,
  Tv,
  Cpu,
  Palette,
  Server,
  Star,
  Zap,
  ChevronRight,
  Search
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";

const categories = [
  { id: "all", name: "Всё", icon: Globe },
  { id: "clients", name: "Клиенты", icon: HardDrive },
  { id: "trackers", name: "Трекеры", icon: Download },
  { id: "vpn", name: "VPN", icon: Lock },
  { id: "hosting", name: "Хостинги", icon: Server },
  { id: "tools", name: "Инструменты", icon: Zap },
  { id: "telegram", name: "Telegram", icon: MessageCircle },
];

const torrentClients = [
  {
    name: "qBittorrent",
    description: "Лучший бесплатный клиент. Открытый код, без рекламы и майнеров.",
    url: "https://www.qbittorrent.org/",
    recommended: true,
    platform: "Windows, Mac, Linux"
  },
  {
    name: "Transmission",
    description: "Лёгкий и минималистичный клиент для Mac и Linux.",
    url: "https://transmissionbt.com/",
    platform: "Mac, Linux"
  },
  {
    name: "LibreTorrent",
    description: "Для Android. Открытый код, без рекламы.",
    url: "https://github.com/proninyaroslav/libretorrent",
    platform: "Android"
  },
];

const trackers = [
  {
    category: "🎮 Софт и игры",
    color: "hsl(var(--primary))",
    sites: [
      { name: "RuTracker", url: "https://rutracker.org", desc: "Всё что угодно", hot: true },
      { name: "1337x", url: "https://1337x.to", desc: "Международный" },
      { name: "FitGirl Repacks", url: "https://fitgirl-repacks.site", desc: "Сжатые игры", hot: true },
      { name: "DODI Repacks", url: "https://dodi-repacks.site", desc: "Быстрые репаки" },
      { name: "Online-Fix", url: "https://online-fix.me", desc: "Онлайн в пиратках" },
      { name: "CS.RIN.RU", url: "https://cs.rin.ru", desc: "Steam Underground" },
    ]
  },
  {
    category: "🎬 Фильмы и сериалы",
    color: "hsl(280 80% 60%)",
    sites: [
      { name: "Kinozal", url: "https://kinozal.tv", desc: "Качественные раздачи" },
      { name: "HDRezka", url: "https://hdrezka.ag", desc: "Онлайн просмотр", hot: true },
      { name: "Lordfilm", url: "https://lordfilm.lu", desc: "Фильмы онлайн" },
    ]
  },
  {
    category: "🎌 Аниме",
    color: "hsl(330 80% 60%)",
    sites: [
      { name: "AniLibria", url: "https://anilibria.tv", desc: "Лучшая озвучка", hot: true },
      { name: "AnimeGO", url: "https://animego.org", desc: "Огромная база" },
      { name: "Shikimori", url: "https://shikimori.one", desc: "Каталог + трекер" },
    ]
  },
  {
    category: "📚 Книги и курсы",
    color: "hsl(145 60% 45%)",
    sites: [
      { name: "Library Genesis", url: "https://libgen.is", desc: "Научная литература", hot: true },
      { name: "Z-Library", url: "https://z-lib.org", desc: "Электронные книги" },
      { name: "Flibusta", url: "https://flibusta.is", desc: "Художественная" },
      { name: "Coursehunter", url: "https://coursehunter.net", desc: "IT-курсы", hot: true },
    ]
  },
  {
    category: "🎵 Музыка",
    color: "hsl(45 90% 50%)",
    sites: [
      { name: "Deemix", url: "https://deemix.app", desc: "FLAC с Deezer", hot: true },
      { name: "Soulseek", url: "https://slsknet.org", desc: "Редкая музыка" },
    ]
  },
  {
    category: "💻 Софт и активация",
    color: "hsl(200 80% 50%)",
    sites: [
      { name: "LRepacks", url: "https://lrepacks.net", desc: "Портативный софт" },
      { name: "MAS (GitHub)", url: "https://github.com/massgravel/Microsoft-Activation-Scripts", desc: "Windows/Office", hot: true },
      { name: "Monkrus", url: "https://w14.monkrus.ws", desc: "Adobe CC" },
    ]
  },
];

const vpnServices = [
  {
    name: "Amnezia VPN",
    desc: "Бесплатный, обходит РКН. Нужен свой сервер.",
    url: "https://amnezia.org",
    recommended: true,
    forRussia: true,
    price: "Бесплатно"
  },
  {
    name: "Outline VPN",
    desc: "От Google. Простая настройка своего сервера.",
    url: "https://getoutline.org",
    recommended: true,
    forRussia: true,
    price: "Бесплатно"
  },
  {
    name: "Windscribe",
    desc: "10GB бесплатно. Работает через WStunnel.",
    url: "https://windscribe.com",
    forRussia: true,
    price: "от $0"
  },
  {
    name: "Mullvad VPN",
    desc: "Анонимный, без логов. Принимает крипту.",
    url: "https://mullvad.net",
    price: "€5/мес"
  },
  {
    name: "ProtonVPN",
    desc: "Швейцарский. Есть бесплатный план.",
    url: "https://protonvpn.com",
    price: "от $0"
  },
];

const hostingServices = [
  {
    name: "Oracle Cloud",
    desc: "Бесплатный VPS навсегда! 1GB RAM, идеален для VPN.",
    url: "https://cloud.oracle.com",
    rating: "4.5",
    price: "Бесплатно",
    hot: true
  },
  {
    name: "Aéza",
    desc: "Дешёвые VPS в Европе. Анонимная оплата крипой.",
    url: "https://aeza.net",
    rating: "4.7",
    price: "от 3€"
  },
  {
    name: "Timeweb Cloud",
    desc: "Российский, отличная поддержка 24/7.",
    url: "https://timeweb.cloud",
    rating: "4.8",
    price: "от 199₽"
  },
  {
    name: "Hetzner",
    desc: "Немецкий, надёжный. Мощные серверы.",
    url: "https://hetzner.com",
    rating: "4.9",
    price: "от 4€"
  },
  {
    name: "DigitalOcean",
    desc: "Популярный. $200 бонус новым на 2 месяца.",
    url: "https://digitalocean.com",
    rating: "4.7",
    price: "от $4"
  },
];

const tools = [
  {
    category: "🌐 Браузеры",
    items: [
      { 
        name: "Brave", 
        desc: "Встроенный блокировщик рекламы", 
        url: "https://brave.com",
        alternatives: ["Firefox", "Vivaldi"]
      },
      { 
        name: "Tor Browser", 
        desc: "Максимальная анонимность", 
        url: "https://torproject.org" 
      },
    ]
  },
  {
    category: "🛡️ Расширения",
    items: [
      { 
        name: "uBlock Origin", 
        desc: "Лучший блокировщик рекламы", 
        url: "https://ublockorigin.com",
        hot: true,
        alternatives: ["AdGuard"]
      },
      { 
        name: "SponsorBlock", 
        desc: "Пропуск рекламы в YouTube", 
        url: "https://sponsor.ajay.app" 
      },
    ]
  },
  {
    category: "📧 Временная почта",
    items: [
      { 
        name: "Temp Mail", 
        desc: "Быстрая временная почта", 
        url: "https://temp-mail.org",
        alternatives: ["Guerrilla Mail", "10 Minute Mail", "Mohmal"]
      },
      { 
        name: "SimpleLogin", 
        desc: "Алиасы для основной почты", 
        url: "https://simplelogin.io",
        alternatives: ["AnonAddy", "Firefox Relay"]
      },
    ]
  },
  {
    category: "🔒 Безопасность",
    items: [
      { 
        name: "VirusTotal", 
        desc: "Проверка файлов 70+ антивирусами", 
        url: "https://virustotal.com",
        hot: true
      },
      { 
        name: "Have I Been Pwned", 
        desc: "Проверка утечки паролей", 
        url: "https://haveibeenpwned.com" 
      },
      { 
        name: "Bitwarden", 
        desc: "Бесплатный менеджер паролей", 
        url: "https://bitwarden.com",
        alternatives: ["KeePassXC", "1Password"]
      },
    ]
  },
  {
    category: "📥 Загрузчики",
    items: [
      { 
        name: "yt-dlp", 
        desc: "YouTube и 1000+ сайтов", 
        url: "https://github.com/yt-dlp/yt-dlp",
        hot: true,
        alternatives: ["youtube-dl"]
      },
      { 
        name: "Cobalt", 
        desc: "Скачивание видео онлайн", 
        url: "https://cobalt.tools",
        alternatives: ["SaveFrom", "9xbuddy"]
      },
      { 
        name: "JDownloader", 
        desc: "Универсальный загрузчик", 
        url: "https://jdownloader.org" 
      },
    ]
  },
  {
    category: "🔧 Полезное",
    items: [
      { 
        name: "12ft.io", 
        desc: "Обход paywall статей", 
        url: "https://12ft.io",
        alternatives: ["Archive.today"]
      },
      { 
        name: "Wayback Machine", 
        desc: "Архив интернета", 
        url: "https://web.archive.org" 
      },
      { 
        name: "Remove.bg", 
        desc: "Удаление фона с фото", 
        url: "https://remove.bg",
        alternatives: ["PhotoRoom", "Erase.bg"]
      },
    ]
  },
];

const telegramChannels = [
  {
    category: "🔐 VPN и блокировки",
    channels: [
      { name: "@zatelecom", desc: "Новости о блокировках" },
      { name: "@vpnfail", desc: "Какие VPN работают" },
      { name: "@outline_vpn_official", desc: "Официальный Outline" },
    ]
  },
  {
    category: "🎮 Раздачи",
    channels: [
      { name: "@easyfreegames", desc: "Бесплатные игры EGS/Steam", hot: true },
      { name: "@origin_games", desc: "Игры для PC" },
      { name: "@pdalife_official", desc: "Android приложения" },
    ]
  },
  {
    category: "📚 Курсы",
    channels: [
      { name: "@coursehunters", desc: "IT-курсы", hot: true },
      { name: "@free_edu_courses", desc: "Бесплатные курсы" },
      { name: "@progbook", desc: "Книги по программированию" },
    ]
  },
];

const safetyTips = [
  "Всегда используй VPN при скачивании торрентов",
  "Проверяй файлы на VirusTotal перед запуском",
  "Смотри на количество сидеров и комментарии",
  "Используй qBittorrent — он без рекламы",
  "Не вводи данные карты на пиратских сайтах",
];

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContent = (category: string) => {
    if (activeCategory === "all") return true;
    return activeCategory === category;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3"
              style={{ background: "hsl(var(--primary) / 0.1)" }}
            >
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: "hsl(var(--primary))" }} />
              <span className="text-xs sm:text-sm font-medium" style={{ color: "hsl(var(--primary))" }}>Мега-гайд</span>
            </motion.div>
            
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3">
              Полезные <span className="gradient-text">ресурсы</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Торренты, VPN, хостинги и инструменты
            </p>
          </div>

          {/* Warning */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="p-3 sm:p-4 rounded-xl mb-6 flex items-start gap-3"
            style={{ background: "hsl(45 90% 50% / 0.08)", border: "1px solid hsl(45 90% 50% / 0.2)" }}
          >
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" style={{ color: "hsl(45 90% 50%)" }} />
            <p className="text-xs sm:text-sm text-muted-foreground">
              Информация в образовательных целях. Поддержи разработчиков покупкой, если продукт понравился.
            </p>
          </motion.div>

          {/* Search and Category tabs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
            {/* Search */}
            <div className="relative flex-shrink-0 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск ресурсов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full text-sm bg-transparent outline-none transition-colors"
                style={{ 
                  background: "hsl(var(--muted))", 
                  border: "1px solid hsl(var(--border))" 
                }}
              />
            </div>
            
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all"
                    style={{
                      background: isActive ? "hsl(var(--primary))" : "hsl(var(--muted))",
                      color: isActive ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))"
                    }}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Torrent Clients */}
          {filteredContent("clients") && (
            <section className="mb-10 sm:mb-12">
              <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                <HardDrive className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
                Торрент-клиенты
              </h2>
              
              <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
                {torrentClients.map((client, i) => (
                  <motion.a
                    key={client.name}
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative p-4 rounded-xl border transition-colors"
                    style={{ 
                      background: "hsl(var(--card))", 
                      borderColor: client.recommended ? "hsl(var(--primary) / 0.3)" : "hsl(var(--border))"
                    }}
                  >
                    {client.recommended && (
                      <span 
                        className="absolute -top-2 right-3 px-2 py-0.5 rounded text-[10px] font-medium"
                        style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
                      >
                        ⭐ Лучший
                      </span>
                    )}
                    <h3 className="font-semibold text-sm sm:text-base mb-1">{client.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{client.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">{client.platform}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </section>
          )}

          {/* Trackers */}
          {filteredContent("trackers") && (
            <section className="mb-10 sm:mb-12">
              <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                <Download className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
                Трекеры и сайты
              </h2>
              
              <div className="space-y-6">
                {trackers.map((cat, catIdx) => (
                  <div key={cat.category}>
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground">{cat.category}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                      {cat.sites.map((site, i) => (
                        <a
                          key={site.name}
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative p-3 rounded-lg border transition-colors"
                          style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                        >
                          {site.hot && (
                            <span 
                              className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full"
                              style={{ background: cat.color }}
                            />
                          )}
                          <div className="font-medium text-xs sm:text-sm truncate">{site.name}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{site.desc}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* VPN */}
          {filteredContent("vpn") && (
            <section className="mb-10 sm:mb-12">
              <h2 className="text-lg sm:text-xl font-bold mb-1 flex items-center gap-2">
                <Lock className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
                VPN для России
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Для Amnezia/Outline нужен свой VPS за границей
              </p>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {vpnServices.map((vpn, i) => (
                  <motion.a
                    key={vpn.name}
                    href={vpn.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative p-4 rounded-xl border transition-colors"
                    style={{ 
                      background: "hsl(var(--card))", 
                      borderColor: vpn.recommended ? "hsl(145 60% 45% / 0.3)" : "hsl(var(--border))"
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        {vpn.forRussia && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded mr-2" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}>
                            🇷🇺 РФ
                          </span>
                        )}
                        {vpn.recommended && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "hsl(145 60% 45% / 0.15)", color: "hsl(145 60% 45%)" }}>
                            ✓ Рекомендую
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium" style={{ color: "hsl(145 60% 45%)" }}>{vpn.price}</span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base mb-1">{vpn.name}</h3>
                    <p className="text-xs text-muted-foreground">{vpn.desc}</p>
                  </motion.a>
                ))}
              </div>
            </section>
          )}

          {/* Hosting */}
          {filteredContent("hosting") && (
            <section className="mb-10 sm:mb-12">
              <h2 className="text-lg sm:text-xl font-bold mb-1 flex items-center gap-2">
                <Server className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
                Хостинги VPS
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Для своего VPN, сайтов, ботов
              </p>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {hostingServices.map((host, i) => (
                  <motion.a
                    key={host.name}
                    href={host.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative p-4 rounded-xl border transition-colors"
                    style={{ 
                      background: "hsl(var(--card))", 
                      borderColor: host.hot ? "hsl(145 60% 45% / 0.3)" : "hsl(var(--border))"
                    }}
                  >
                    {host.hot && (
                      <span 
                        className="absolute -top-2 right-3 px-2 py-0.5 rounded text-[10px] font-medium"
                        style={{ background: "hsl(145 60% 45%)", color: "white" }}
                      >
                        🔥 Бесплатно
                      </span>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm sm:text-base">{host.name}</h3>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {host.rating}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{host.desc}</p>
                    <span className="text-xs font-medium" style={{ color: "hsl(145 60% 45%)" }}>{host.price}</span>
                  </motion.a>
                ))}
              </div>
            </section>
          )}

          {/* Tools */}
          {filteredContent("tools") && (
            <section className="mb-10 sm:mb-12">
              <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" style={{ color: "hsl(45 90% 50%)" }} />
                Полезные инструменты
              </h2>
              
              <div className="space-y-6">
                {tools.map((cat) => (
                  <div key={cat.category}>
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground">{cat.category}</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {cat.items.map((item) => (
                        <div
                          key={item.name}
                          className="p-4 rounded-xl border"
                          style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                        >
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between mb-1"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{item.name}</span>
                              {item.hot && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}>
                                  HOT
                                </span>
                              )}
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </a>
                          <p className="text-xs text-muted-foreground mb-2">{item.desc}</p>
                          {item.alternatives && (
                            <div className="flex flex-wrap gap-1">
                              <span className="text-[10px] text-muted-foreground">Аналоги:</span>
                              {item.alternatives.map((alt) => (
                                <span 
                                  key={alt} 
                                  className="text-[10px] px-1.5 py-0.5 rounded"
                                  style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                                >
                                  {alt}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Telegram */}
          {filteredContent("telegram") && (
            <section className="mb-10 sm:mb-12">
              <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" style={{ color: "hsl(200 80% 50%)" }} />
                Telegram каналы
              </h2>
              
              <div className="space-y-6">
                {telegramChannels.map((cat) => (
                  <div key={cat.category}>
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground">{cat.category}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {cat.channels.map((channel) => (
                        <a
                          key={channel.name}
                          href={`https://t.me/${channel.name.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative p-3 rounded-lg border transition-colors"
                          style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                        >
                          {channel.hot && (
                            <span 
                              className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full"
                              style={{ background: "hsl(200 80% 50%)" }}
                            />
                          )}
                          <div className="font-medium text-xs sm:text-sm" style={{ color: "hsl(200 80% 50%)" }}>{channel.name}</div>
                          <div className="text-[10px] text-muted-foreground">{channel.desc}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Safety Tips */}
          <section className="mb-6">
            <div 
              className="p-4 sm:p-6 rounded-xl"
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
          </section>
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
