import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const GENERATE_IMAGE_URL = "https://functions.poehali.dev/cbecdf03-0400-48c9-91e7-d29738589d3e";

const HERO_IMG = "https://cdn.poehali.dev/projects/eb5e70ff-2bdc-4d2d-898c-a23deca1bc7c/files/d4e569aa-2541-42a1-868b-8f37d36eb780.jpg";
const CATS_IMG = "https://cdn.poehali.dev/projects/eb5e70ff-2bdc-4d2d-898c-a23deca1bc7c/files/00f14ca2-7eeb-4ea3-8f73-b732a95d3561.jpg";
const GEN_IMG = "https://cdn.poehali.dev/projects/eb5e70ff-2bdc-4d2d-898c-a23deca1bc7c/files/a265c021-9c22-4f74-a6fd-45f940c8f9a6.jpg";

type Section = "home" | "fashion" | "ar" | "cartoon" | "generator" | "contacts";

const navItems: { id: Section; label: string; emoji: string }[] = [
  { id: "home", label: "Главная", emoji: "🏠" },
  { id: "fashion", label: "Показ мод", emoji: "🐱" },
  { id: "ar", label: "AR Примерка", emoji: "📸" },
  { id: "cartoon", label: "Мультик", emoji: "🎬" },
  { id: "generator", label: "Генератор", emoji: "✨" },
  { id: "contacts", label: "Контакты", emoji: "👻" },
];

function SpiderWebCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const posClass = {
    tl: "top-0 left-0",
    tr: "top-0 right-0 scale-x-[-1]",
    bl: "bottom-0 left-0 scale-y-[-1]",
    br: "bottom-0 right-0 scale-[-1]",
  }[position];

  return (
    <div className={`absolute ${posClass} w-32 h-32 pointer-events-none opacity-40`}>
      <svg viewBox="0 0 120 120" className="w-full h-full animate-web-sway">
        <g stroke="#FF6B00" strokeWidth="0.8" fill="none" opacity="0.7">
          <line x1="0" y1="0" x2="120" y2="0" />
          <line x1="0" y1="0" x2="0" y2="120" />
          <line x1="0" y1="0" x2="120" y2="120" />
          <line x1="0" y1="0" x2="60" y2="120" />
          <line x1="0" y1="0" x2="120" y2="60" />
          {[20, 40, 65, 95].map((r, i) => (
            <path key={i} d={`M ${r} 0 Q ${r * 0.5} ${r * 0.5} 0 ${r}`} stroke="#FF6B00" opacity={0.6 - i * 0.1} />
          ))}
        </g>
        <circle cx="0" cy="0" r="4" fill="#FF6B00" opacity="0.8" />
      </svg>
    </div>
  );
}

function FloatingDecos() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute top-20 left-10 text-5xl animate-float opacity-30" style={{ animationDelay: "0s" }}>🎃</div>
      <div className="absolute top-40 right-16 text-3xl animate-float opacity-25" style={{ animationDelay: "1s" }}>🦇</div>
      <div className="absolute top-1/3 left-6 text-2xl animate-float opacity-20" style={{ animationDelay: "2s" }}>🕷️</div>
      <div className="absolute bottom-1/3 right-10 text-4xl animate-float opacity-25" style={{ animationDelay: "0.5s" }}>🕸️</div>
      <div className="absolute bottom-20 left-20 text-3xl animate-float opacity-20" style={{ animationDelay: "1.5s" }}>💀</div>
      <div className="absolute top-2/3 right-20 text-2xl animate-float opacity-15" style={{ animationDelay: "2.5s" }}>🌙</div>
    </div>
  );
}

function Navbar({ active, onNav }: { active: Section; onNav: (s: Section) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
      style={{ background: "rgba(13,5,21,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,107,0,0.2)" }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <button onClick={() => onNav("home")} className="flex items-center gap-2 group">
          <span className="text-3xl animate-float" style={{ animationDuration: "2s" }}>🎃</span>
          <span className="font-creepster text-2xl neon-orange group-hover:scale-105 transition-transform">
            Monster<span className="text-white mx-1">Holidays</span>
          </span>
        </button>
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => onNav(item.id)}
              className={`nav-link px-3 py-2 rounded-xl text-sm font-bold transition-all ${active === item.id ? "active bg-orange-900/30" : "hover:bg-white/5"}`}>
              <span className="mr-1">{item.emoji}</span>{item.label}
            </button>
          ))}
        </div>
        <button className="lg:hidden text-white/70 hover:text-orange-500 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={24} />
        </button>
      </div>
      {menuOpen && (
        <div className="lg:hidden mt-3 pb-3 border-t border-white/10 pt-3 animate-fade-in">
          <div className="flex flex-col gap-1 max-w-6xl mx-auto">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => { onNav(item.id); setMenuOpen(false); }}
                className={`nav-link text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${active === item.id ? "active bg-orange-900/30" : "hover:bg-white/5"}`}>
                <span className="mr-2">{item.emoji}</span>{item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function HeroSection({ onNav }: { onNav: (s: Section) => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={HERO_IMG} alt="Monster Holidays" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(13,5,21,0.4) 0%, rgba(13,5,21,0.8) 60%, #0D0515 100%)" }} />
      </div>
      <SpiderWebCorner position="tl" />
      <SpiderWebCorner position="tr" />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="text-7xl mb-4 animate-float inline-block" style={{ filter: "drop-shadow(0 0 20px #FF6B00)" }}>🎃</div>
        <h1 className="font-creepster text-6xl md:text-8xl lg:text-9xl mb-4 animate-slide-up"
          style={{ background: "linear-gradient(135deg, #FF6B00, #FF9500, #39FF14)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 30px #FF6B0080)" }}>
          Monster Holidays
        </h1>
        <p className="text-xl md:text-2xl text-white/70 mb-3 font-nunito animate-slide-up delay-200 font-semibold">
          🦇 Хэллоуин только для своих 🦇
        </p>
        <p className="text-base md:text-lg text-white/50 mb-10 font-nunito animate-slide-up delay-300 max-w-xl mx-auto">
          Создавай мультики, примеряй костюмы, генерируй арт и смотри модный показ котиков!
        </p>
        <div className="flex flex-wrap gap-4 justify-center animate-slide-up delay-400">
          <button className="btn-primary text-base" onClick={() => onNav("generator")}>✨ Генерировать картинку</button>
          <button className="btn-secondary text-base" onClick={() => onNav("ar")}>📸 Примерить костюм</button>
        </div>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up delay-500">
          {[
            { emoji: "🎬", label: "Мультики", sub: "Хэллоуин-анимации" },
            { emoji: "🐱", label: "Показ мод", sub: "Котики в костюмах" },
            { emoji: "🤳", label: "AR Маски", sub: "Примерка на фото" },
            { emoji: "🎨", label: "Генератор", sub: "ИИ-иллюстрации" },
          ].map((item, i) => (
            <div key={i} className="card-halloween neon-border-orange p-4 text-center">
              <div className="text-3xl mb-2">{item.emoji}</div>
              <div className="font-creepster text-lg neon-orange">{item.label}</div>
              <div className="text-xs text-white/50 font-nunito mt-1">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FashionSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <SpiderWebCorner position="tr" />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-5xl mb-3 animate-float">🐱</div>
          <h2 className="font-creepster text-5xl md:text-6xl neon-orange mb-3">Показ мод</h2>
          <p className="text-white/60 font-nunito text-lg">Хэллоуинский подиум для самых стильных котиков!</p>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="card-halloween neon-border-orange overflow-hidden rounded-3xl">
            <img src={CATS_IMG} alt="Показ мод котиков" className="w-full h-72 object-cover" />
            <div className="p-6">
              <h3 className="font-creepster text-2xl neon-orange mb-2">Котики на подиуме 🎃</h3>
              <p className="text-white/60 font-nunito text-sm leading-relaxed">
                Эксклюзивный видеопоказ от автора: котики в ведьминских шляпах, вампирских плащах и костюмах привидений дефилируют по хэллоуинскому подиуму!
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="card-halloween neon-border-purple p-6 text-center">
              <div className="text-4xl mb-3">🎥</div>
              <h3 className="font-creepster text-xl neon-purple mb-2">Видео от автора</h3>
              <p className="text-white/50 font-nunito text-sm mb-4">Специальная видеозапись эксклюзивного показа</p>
              <button className="btn-primary w-full">Смотреть шоу</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["🧙‍♀️ Ведьмочки", "🧛 Вампиры", "👻 Привидения"].map((cat, i) => (
                <div key={i} className="card-halloween neon-border-orange p-3 text-center">
                  <div className="text-xl mb-1">{cat.split(" ")[0]}</div>
                  <div className="text-xs text-white/60 font-nunito font-bold">{cat.split(" ")[1]}</div>
                </div>
              ))}
            </div>
            <div className="card-halloween p-4 text-center" style={{ border: "1px solid rgba(57,255,20,0.3)" }}>
              <span className="neon-green font-creepster text-lg">🐾 Следующий показ: 31 октября</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ARSection() {
  const [dragging, setDragging] = useState(false);
  const [uploadedImg, setUploadedImg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const costumes = [
    { emoji: "🎃", name: "Тыква" }, { emoji: "🧙‍♀️", name: "Ведьма" },
    { emoji: "🧛", name: "Вампир" }, { emoji: "👻", name: "Призрак" },
    { emoji: "💀", name: "Скелет" }, { emoji: "🐱", name: "Котик" },
  ];
  const [selected, setSelected] = useState(0);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setUploadedImg(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <SpiderWebCorner position="bl" />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-5xl mb-3 animate-float">📸</div>
          <h2 className="font-creepster text-5xl md:text-6xl neon-green mb-3">AR Примерка</h2>
          <p className="text-white/60 font-nunito text-lg">Загрузи своё фото и примерь хэллоуинский костюм!</p>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="flex flex-col gap-5">
            <div
              className={`card-halloween p-8 text-center cursor-pointer transition-all rounded-3xl`}
              style={{ border: dragging ? "2px solid #39FF14" : "2px dashed rgba(255,107,0,0.5)", minHeight: 280, transform: dragging ? "scale(1.02)" : "scale(1)" }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              {uploadedImg ? (
                <div className="relative">
                  <img src={uploadedImg} alt="Твоё фото" className="w-full h-56 object-cover rounded-2xl" />
                  <div className="absolute top-2 right-2 text-4xl animate-float">{costumes[selected].emoji}</div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-56 gap-4">
                  <div className="text-6xl animate-float">📷</div>
                  <p className="font-creepster text-xl neon-orange">Загрузи своё фото</p>
                  <p className="text-white/40 text-sm font-nunito">перетащи или нажми</p>
                </div>
              )}
            </div>
            {uploadedImg && (
              <button className="btn-primary w-full text-base animate-fade-in">
                ✨ Применить костюм «{costumes[selected].name}»
              </button>
            )}
          </div>
          <div className="flex flex-col gap-5">
            <h3 className="font-creepster text-2xl text-white/80 text-center">Выбери костюм:</h3>
            <div className="grid grid-cols-3 gap-4">
              {costumes.map((c, i) => (
                <button key={i} onClick={() => setSelected(i)}
                  className={`card-halloween p-5 text-center transition-all rounded-2xl ${selected === i ? "scale-105" : "opacity-70 hover:opacity-100"}`}
                  style={{ border: selected === i ? "1px solid #39FF14" : "1px solid rgba(255,107,0,0.3)" }}>
                  <div className="text-4xl mb-2">{c.emoji}</div>
                  <div className="font-creepster text-base" style={{ color: selected === i ? "#39FF14" : "rgba(255,255,255,0.6)" }}>{c.name}</div>
                </button>
              ))}
            </div>
            <div className="card-halloween p-5 text-center rounded-2xl" style={{ border: "1px solid rgba(191,0,255,0.4)" }}>
              <div className="text-3xl mb-2">🤳</div>
              <p className="font-creepster text-lg neon-purple mb-1">Фото с персонажами</p>
              <p className="text-white/50 text-sm font-nunito">Сделай снимок с мультяшными монстрами Хэллоуина!</p>
              <button className="btn-secondary mt-3 w-full text-sm">Открыть камеру</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CartoonSection() {
  const scenes = [
    { emoji: "🏚️", title: "Заброшенный дом", desc: "Тёмная ночь, ухающие совы, скрипящие двери..." },
    { emoji: "🌕", title: "Лунная ночь", desc: "Полная луна, силуэты летучих мышей, вой волков..." },
    { emoji: "🪄", title: "Ведьмин лес", desc: "Густой туман, светящиеся глаза, котёл с зельем..." },
    { emoji: "⚰️", title: "Кладбище монстров", desc: "Восстающие из могил, фонари с тыквами..." },
  ];
  const [scene, setScene] = useState(0);
  const [chars, setChars] = useState<string[]>([]);
  const charOptions = ["🧙‍♀️", "🧛", "👻", "🎃", "💀", "🕷️", "🦇", "🐱"];
  const toggleChar = (c: string) => setChars(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <SpiderWebCorner position="tl" />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-5xl mb-3 animate-float">🎬</div>
          <h2 className="font-creepster text-5xl md:text-6xl neon-orange mb-3">Создай мультик</h2>
          <p className="text-white/60 font-nunito text-lg">Выбери сцену и персонажей — и мы создадим твой Хэллоуин-мультик!</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="font-creepster text-xl neon-orange">1. Выбери сцену</h3>
            {scenes.map((s, i) => (
              <button key={i} onClick={() => setScene(i)}
                className={`card-halloween p-4 text-left transition-all rounded-2xl ${scene === i ? "" : "opacity-60 hover:opacity-90"}`}
                style={{ border: scene === i ? "1px solid #FF6B00" : "1px solid rgba(255,107,0,0.2)" }}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{s.emoji}</span>
                  <div>
                    <div className="font-creepster text-base" style={{ color: scene === i ? "#FF6B00" : "rgba(255,255,255,0.8)" }}>{s.title}</div>
                    <div className="text-xs text-white/40 font-nunito mt-0.5 leading-relaxed">{s.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-creepster text-xl neon-green">2. Добавь персонажей</h3>
            <div className="grid grid-cols-4 gap-3">
              {charOptions.map((c, i) => (
                <button key={i} onClick={() => toggleChar(c)}
                  className={`card-halloween p-3 text-center rounded-2xl text-2xl transition-all ${chars.includes(c) ? "scale-110" : "opacity-50 hover:opacity-80"}`}
                  style={{ border: chars.includes(c) ? "1px solid #39FF14" : "1px solid rgba(255,107,0,0.2)" }}>
                  {c}
                </button>
              ))}
            </div>
            <div className="card-halloween p-4 rounded-2xl" style={{ border: "1px solid rgba(255,107,0,0.3)" }}>
              <p className="text-white/50 text-xs font-nunito mb-2">Выбрано:</p>
              <div className="text-2xl min-h-8">{chars.length > 0 ? chars.join(" ") : <span className="text-white/20 text-sm">никого...</span>}</div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-creepster text-xl neon-purple">3. Создай!</h3>
            <div className="card-halloween p-6 rounded-2xl flex-1 flex flex-col items-center justify-center text-center" style={{ minHeight: 220, border: "1px solid rgba(191,0,255,0.4)" }}>
              <div className="text-5xl mb-3 animate-float">{scenes[scene].emoji}</div>
              <div className="font-creepster text-xl text-white/80 mb-2">{scenes[scene].title}</div>
              <div className="text-white/40 text-sm font-nunito mb-4">{chars.length > 0 ? `Персонажи: ${chars.join(" ")}` : "Добавь персонажей..."}</div>
            </div>
            <button className="btn-primary w-full text-base">🎬 Создать мультик</button>
            <button className="btn-secondary w-full text-sm">🎲 Случайный сюжет</button>
          </div>
        </div>
      </div>
    </section>
  );
}

const QUICK_PROMPTS = [
  { tag: "🧙 Ведьма с котлом", text: "witch with cauldron brewing potion" },
  { tag: "🏰 Замок призраков", text: "haunted castle with ghosts" },
  { tag: "🎃 Тыквенная деревня", text: "pumpkin village with jack-o-lanterns" },
  { tag: "🌕 Вой на луну", text: "werewolf howling at full moon" },
];

const STYLE_KEYS = ["cartoon", "realistic", "pixel", "fantasy"];
const STYLE_LABELS = ["🎨 Мультяшный", "🖼️ Реалистичный", "👾 Пиксельарт", "🌌 Фэнтези"];

function GeneratorSection() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(GENERATE_IMAGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), style: STYLE_KEYS[style] }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка генерации");
      } else {
        setResult(data.url);
      }
    } catch {
      setError("Ошибка соединения. Попробуй ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const randomPrompt = () => {
    const random = QUICK_PROMPTS[Math.floor(Math.random() * QUICK_PROMPTS.length)];
    setPrompt(random.text);
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <SpiderWebCorner position="br" />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-5xl mb-3 animate-float">✨</div>
          <h2 className="font-creepster text-5xl md:text-6xl neon-green mb-3">Генератор картинок</h2>
          <p className="text-white/60 font-nunito text-lg">ИИ создаст уникальный Хэллоуин-арт по твоему описанию</p>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="font-creepster text-xl text-white/80 mb-3">Стиль:</h3>
              <div className="grid grid-cols-2 gap-3">
                {STYLE_LABELS.map((s, i) => (
                  <button key={i} onClick={() => setStyle(i)}
                    className="card-halloween p-3 text-center rounded-2xl text-sm font-bold font-nunito transition-all"
                    style={{ border: style === i ? "1px solid #39FF14" : "1px solid rgba(255,107,0,0.2)", color: style === i ? "#39FF14" : "rgba(255,255,255,0.6)", background: style === i ? "rgba(57,255,20,0.08)" : undefined }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-creepster text-xl text-white/80 mb-3">Описание:</h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Опиши свою картинку... например: «рыжий кот в костюме Дракулы на фоне замка»"
                rows={4}
                className="w-full rounded-2xl p-4 text-sm font-nunito text-white/80 placeholder-white/30 resize-none focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(57,255,20,0.3)", boxShadow: "0 0 10px rgba(57,255,20,0.1)" }}
              />
            </div>
            <div className="flex gap-3">
              <button className="btn-primary flex-1" onClick={generate} disabled={loading || !prompt.trim()}
                style={{ opacity: loading || !prompt.trim() ? 0.6 : 1 }}>
                {loading ? "⏳ Создаю..." : "✨ Сгенерировать"}
              </button>
              <button className="btn-secondary px-4" onClick={randomPrompt} title="Случайная идея">🎲</button>
            </div>
            {error && (
              <div className="rounded-2xl p-4 text-sm font-nunito" style={{ background: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.3)", color: "#ff6b6b" }}>
                ⚠️ {error}
              </div>
            )}
            <div>
              <p className="text-white/40 text-xs font-nunito mb-2">Быстрые идеи:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((q, i) => (
                  <button key={i} onClick={() => setPrompt(q.text)}
                    className="text-xs px-3 py-1.5 rounded-full font-nunito font-bold transition-all hover:scale-105"
                    style={{ background: "rgba(255,107,0,0.15)", border: "1px solid rgba(255,107,0,0.3)", color: "#FF9500" }}>
                    {q.tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="card-halloween rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(57,255,20,0.3)", minHeight: 320 }}>
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <div className="text-5xl animate-spin-slow">🎃</div>
                  <p className="font-creepster text-xl neon-orange animate-flicker">Колдую картинку...</p>
                  <p className="text-white/40 text-xs font-nunito">Это займёт ~30 секунд</p>
                </div>
              ) : result ? (
                <div>
                  <img src={result} alt="Сгенерированная картинка" className="w-full object-cover rounded-3xl" style={{ maxHeight: 400 }} />
                  <div className="p-5">
                    <p className="font-creepster text-lg neon-green mb-1">✅ Готово!</p>
                    <a href={result} download className="text-white/50 text-xs font-nunito hover:text-white transition-colors">
                      ⬇️ Скачать картинку
                    </a>
                  </div>
                </div>
              ) : (
                <div>
                  <img src={GEN_IMG} alt="Пример генерации" className="w-full h-64 object-cover opacity-60" />
                  <div className="p-5">
                    <p className="font-creepster text-lg neon-green mb-1">Пример работы ИИ</p>
                    <p className="text-white/40 text-xs font-nunito">Твоя картинка появится здесь после генерации</p>
                  </div>
                </div>
              )}
            </div>
            <div className="card-halloween p-4 rounded-2xl" style={{ border: "1px solid rgba(191,0,255,0.4)" }}>
              <div className="text-2xl mb-2">🖌️</div>
              <p className="font-creepster text-base neon-purple mb-1">Редактор картинок</p>
              <p className="text-white/40 text-xs font-nunito mb-3">Изменяй сгенерированные изображения: добавляй элементы, меняй цвета, стиль</p>
              <button className="btn-secondary w-full text-sm">Открыть редактор</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactsSection() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <SpiderWebCorner position="tl" />
      <SpiderWebCorner position="br" />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-5xl mb-3 animate-float">👻</div>
          <h2 className="font-creepster text-5xl md:text-6xl neon-orange mb-3">Связаться</h2>
          <p className="text-white/60 font-nunito text-lg">Напиши нам, привидение доставит сообщение! 🦇</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card-halloween p-8 rounded-3xl" style={{ border: "1px solid rgba(255,107,0,0.4)" }}>
            <div className="flex flex-col gap-5">
              <div>
                <label className="font-creepster text-lg neon-orange block mb-2">Твоё имя:</label>
                <input value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Как тебя зовут, монстрик?"
                  className="w-full rounded-xl p-3 text-sm font-nunito text-white/80 placeholder-white/30 focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,107,0,0.3)" }} />
              </div>
              <div>
                <label className="font-creepster text-lg neon-orange block mb-2">Сообщение:</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder="Пиши здесь всё что хочешь..." rows={4}
                  className="w-full rounded-xl p-3 text-sm font-nunito text-white/80 placeholder-white/30 resize-none focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,107,0,0.3)" }} />
              </div>
              <button className="btn-primary w-full">👻 Отправить сообщение</button>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            {[
              { emoji: "📸", label: "Instagram", sub: "@monster.holidays", color: "#FF6B00" },
              { emoji: "💬", label: "Telegram", sub: "@MonsterHolidays", color: "#39FF14" },
              { emoji: "📧", label: "Email", sub: "hello@monster-holidays.ru", color: "#BF00FF" },
            ].map((c, i) => (
              <div key={i} className="card-halloween p-5 rounded-2xl flex items-center gap-4 cursor-pointer hover:scale-105 transition-all"
                style={{ border: `1px solid ${c.color}44`, boxShadow: `0 0 10px ${c.color}22` }}>
                <div className="text-3xl">{c.emoji}</div>
                <div>
                  <div className="font-creepster text-lg" style={{ color: c.color, textShadow: `0 0 10px ${c.color}` }}>{c.label}</div>
                  <div className="text-white/50 text-sm font-nunito">{c.sub}</div>
                </div>
              </div>
            ))}
            <div className="card-halloween p-5 rounded-2xl text-center" style={{ border: "1px solid rgba(255,107,0,0.3)" }}>
              <div className="text-3xl mb-2 animate-float">🎃</div>
              <p className="font-creepster text-base neon-orange">Только для своих!</p>
              <p className="text-white/40 text-xs font-nunito mt-1">Доступ по приглашению от Monster Holidays</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ onNav }: { onNav: (s: Section) => void }) {
  return (
    <footer className="relative py-10 px-4 text-center" style={{ borderTop: "1px solid rgba(255,107,0,0.2)" }}>
      <div className="max-w-6xl mx-auto">
        <button onClick={() => onNav("home")} className="font-creepster text-3xl neon-orange mb-3 block mx-auto hover:scale-105 transition-transform">
          🎃 Monster Holidays
        </button>
        <p className="text-white/30 text-sm font-nunito mb-6">Хэллоуин только для своих — добро пожаловать в клуб монстров!</p>
        <div className="flex justify-center gap-2 flex-wrap">
          {navItems.slice(1).map((item) => (
            <button key={item.id} onClick={() => onNav(item.id)} className="text-white/40 hover:text-orange-500 text-sm font-nunito font-bold transition-colors px-2">
              {item.emoji} {item.label}
            </button>
          ))}
        </div>
        <p className="text-white/20 text-xs font-nunito mt-6">🦇 © 2024 Monster Holidays. Все призраки защищены. 🦇</p>
      </div>
    </footer>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("home");

  const scrollToSection = (id: Section) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id as Section); }); },
      { threshold: 0.3, rootMargin: "-60px 0px -60px 0px" }
    );
    navItems.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen relative" style={{ background: "var(--dark-bg)" }}>
      <FloatingDecos />
      <Navbar active={activeSection} onNav={scrollToSection} />
      <main>
        <div id="home"><HeroSection onNav={scrollToSection} /></div>
        <div id="fashion"><FashionSection /></div>
        <div id="ar"><ARSection /></div>
        <div id="cartoon"><CartoonSection /></div>
        <div id="generator"><GeneratorSection /></div>
        <div id="contacts"><ContactsSection /></div>
      </main>
      <Footer onNav={scrollToSection} />
    </div>
  );
}
