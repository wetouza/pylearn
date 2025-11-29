# 🚀 Деплой PyLearn

## ✅ Билд проверен и готов!

Все страницы работают:
- Главная (/)
- Гайды (/guides)
- VS Code (/vscode)
- Typing Trainer (/typing)
- Сообщество (/community)
- Ресурсы (/resources)

---

## Вариант 1: Vercel (рекомендуется)

### Через CLI:
```bash
cd frontend

# Установи Vercel CLI
npm i -g vercel

# Залогинься (откроется браузер)
vercel login

# Деплой
vercel

# Для production
vercel --prod
```

### Через GitHub (проще):
1. Создай репозиторий на GitHub
2. Залей код:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pylearn.git
git push -u origin main
```
3. Зайди на [vercel.com](https://vercel.com)
4. Нажми "Add New Project"
5. Импортируй репозиторий из GitHub
6. В настройках:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js (автоматически)
7. Нажми **Deploy**

---

## Вариант 2: Netlify

```bash
cd frontend
npm run build

# Установи Netlify CLI
npm i -g netlify-cli

# Залогинься
netlify login

# Деплой
netlify deploy --prod --dir=.next
```

Или через сайт: [netlify.com](https://netlify.com) → New site from Git

---

## Вариант 3: GitHub Pages (бесплатно)

1. В `next.config.js` добавь:
```js
const nextConfig = {
  output: 'export',
  basePath: '/pylearn',
}
```

2. Билд и деплой:
```bash
npm run build
# Загрузи папку out/ в GitHub Pages
```

---

## После деплоя

Твой сайт будет доступен по адресу:
- **Vercel**: `https://pylearn-xxx.vercel.app`
- **Netlify**: `https://pylearn-xxx.netlify.app`

### Кастомный домен
В настройках проекта → Domains → Add Domain

---

## Быстрый деплой одной командой

После логина в Vercel:
```bash
cd frontend && vercel --prod
```

🎉 Готово!
