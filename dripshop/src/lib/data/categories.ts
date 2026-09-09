import { Category, Collection, Creator } from "@/types";

export const collections: Collection[] = [
  { id: "astrocore", name: "ASTROCORE", slug: "astrocore" },
  { id: "creepy-cute", name: "CREEPY CUTE", slug: "creepy-cute" },
  { id: "cursed-abyss", name: "CURSED ABYSS", slug: "cursed-abyss" },
  { id: "dark-mood", name: "DARK MOOD", slug: "dark-mood" },
  { id: "directors-cut", name: "DIRECTORS CUT", slug: "directors-cut" },
  { id: "future-chaos", name: "FUTURE CHAOS", slug: "future-chaos" },
  { id: "freestyle", name: "FREESTYLE", slug: "freestyle" },
  { id: "gods-of-olympus", name: "GODS OF OLYMPUS", slug: "gods-of-olympus" },
  { id: "halloween", name: "HALLOWEEN", slug: "halloween" },
  { id: "identidade", name: "IDENTIDADE", slug: "identidade" },
  { id: "street", name: "LOLJA STREET", slug: "street" },
  { id: "metaru", name: "METARU", slug: "metaru" },
  { id: "old-skull", name: "OLD SKULL", slug: "old-skull" },
  { id: "ruinas", name: "RUÍNAS", slug: "ruinas" },
  { id: "self-data", name: "SELF DATA", slug: "self-data" },
];

export const categories: Category[] = [
  { id: "camisetas", name: "CAMISETAS", slug: "camisetas" },
  { id: "moletom", name: "MOLETOM", slug: "moletom" },
  { id: "manga-longa", name: "MANGA LONGA", slug: "manga-longa" },
  { id: "regata", name: "REGATA", slug: "regata" },
  { id: "cropped", name: "CROPPED", slug: "cropped" },
  { id: "caneca", name: "CANECAS", slug: "caneca" },
  { id: "ecobag", name: "ECOBAG", slug: "ecobag" },
  { id: "touca", name: "TOUCA", slug: "touca" },
  { id: "acessorios", name: "ACESSÓRIOS", slug: "acessorios" },
];

export const themes = [
  { id: "animes", name: "ANIMES", slug: "animes", category: "camisetas" },
  { id: "caveiras", name: "CAVEIRAS", slug: "caveiras", category: "camisetas" },
  { id: "filmes-e-series", name: "FILMES E SÉRIES", slug: "filmes-e-series", category: "camisetas" },
  { id: "games", name: "GAMES", slug: "games", category: "camisetas" },
  { id: "literatura", name: "LITERATURA", slug: "literatura", category: "camisetas" },
  { id: "musica", name: "MÚSICAS", slug: "musica", category: "camisetas" },
  { id: "humor", name: "HUMOR", slug: "humor", category: "camisetas" },
  { id: "terror", name: "TERROR", slug: "terror", category: "camisetas" },
];

export const creators: Creator[] = [
  { id: "mc-lan", name: "MC LAN", slug: "mc-lan", verified: true },
  { id: "tz-da-coronel", name: "TZ DA CORONEL", slug: "tz-da-coronel", verified: true },
  { id: "kawe", name: "KAWE", slug: "kawe", verified: true },
  { id: "raflow", name: "RAFLOW", slug: "raflow", verified: true },
  { id: "ale", name: "ALE", slug: "ale", verified: true },
  { id: "dj-ale-da-coro", name: "DJ ALE DA CORO", slug: "dj-ale-da-coro", verified: true },
  { id: "gasparzinho", name: "GASPARZINHO", slug: "gasparzinho", verified: true },
  { id: "tavin", name: "TAVIN", slug: "tavin", verified: true },
];

export const partners: Creator[] = [
  { id: "lenda-heroi", name: "A Lenda do Herói", slug: "a-lenda-do-heroi" },
  { id: "abelha", name: "Abelha", slug: "abelha" },
  { id: "acf-performance", name: "ACF Performance", slug: "acfperformance" },
  { id: "alemao-caravan", name: "Alemão da Caravan", slug: "alemao-da-caravan" },
  { id: "anatomia-etc", name: "Anatomia Etc", slug: "anatomia-etc" },
  { id: "animadorgas", name: "Animadorgas", slug: "animadorgas" },
  { id: "ataque-critico", name: "Ataque Crítico", slug: "ataque-critico" },
  { id: "bad-vibes", name: "Bad Vibes Memes", slug: "bad-vibes-memes" },
  { id: "bagdex", name: "Bagdex", slug: "bagdex" },
  { id: "cinemagrath", name: "Cinemagrath", slug: "cinemagrath" },
];
