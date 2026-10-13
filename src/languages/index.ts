import { alchemist } from "./alchemist";
import { anchorite } from "./anchorite";
import { bard } from "./bard";
import { devotee } from "./devotee";
import { warrior } from "./warrior";
import type { LanguageId, LanguageModule } from "./types";

/** Tab order follows the climb up the tower. */
export const LANGUAGE_ORDER: readonly LanguageId[] = [
  "devotee",
  "warrior",
  "bard",
  "alchemist",
  "anchorite",
];

const languages: Record<LanguageId, LanguageModule> = {
  devotee,
  warrior,
  bard,
  alchemist,
  anchorite,
};

export const getLanguage = (id: LanguageId): LanguageModule => languages[id];

export const isLanguageId = (value: string | null): value is LanguageId =>
  LANGUAGE_ORDER.includes(value as LanguageId);
