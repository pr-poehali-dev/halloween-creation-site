export const GENERATE_IMAGE_URL = "https://functions.poehali.dev/cbecdf03-0400-48c9-91e7-d29738589d3e";

export const HERO_IMG = "https://cdn.poehali.dev/projects/eb5e70ff-2bdc-4d2d-898c-a23deca1bc7c/files/d4e569aa-2541-42a1-868b-8f37d36eb780.jpg";
export const CATS_IMG = "https://cdn.poehali.dev/projects/eb5e70ff-2bdc-4d2d-898c-a23deca1bc7c/files/00f14ca2-7eeb-4ea3-8f73-b732a95d3561.jpg";
export const GEN_IMG = "https://cdn.poehali.dev/projects/eb5e70ff-2bdc-4d2d-898c-a23deca1bc7c/files/a265c021-9c22-4f74-a6fd-45f940c8f9a6.jpg";

export type Section = "home" | "fashion" | "ar" | "cartoon" | "generator" | "contacts";

export const navItems: { id: Section; label: string; emoji: string }[] = [
  { id: "home", label: "Главная", emoji: "🏠" },
  { id: "fashion", label: "Показ мод", emoji: "🐱" },
  { id: "ar", label: "AR Примерка", emoji: "📸" },
  { id: "cartoon", label: "Мультик", emoji: "🎬" },
  { id: "generator", label: "Генератор", emoji: "✨" },
  { id: "contacts", label: "Контакты", emoji: "👻" },
];

export const QUICK_PROMPTS = [
  { tag: "🧙 Ведьма с котлом", text: "witch with cauldron brewing potion" },
  { tag: "🏰 Замок призраков", text: "haunted castle with ghosts" },
  { tag: "🎃 Тыквенная деревня", text: "pumpkin village with jack-o-lanterns" },
  { tag: "🌕 Вой на луну", text: "werewolf howling at full moon" },
];

export const STYLE_KEYS = ["cartoon", "realistic", "pixel", "fantasy"];
export const STYLE_LABELS = ["🎨 Мультяшный", "🖼️ Реалистичный", "👾 Пиксельарт", "🌌 Фэнтези"];
