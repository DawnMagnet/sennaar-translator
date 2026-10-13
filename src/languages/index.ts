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

const implemented: Partial<Record<LanguageId, LanguageModule>> = { devotee, warrior };

export const getLanguage = (id: LanguageId): LanguageModule | undefined => implemented[id];

export const isLanguageId = (value: string | null): value is LanguageId =>
  LANGUAGE_ORDER.includes(value as LanguageId);
