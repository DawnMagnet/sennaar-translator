import type { Cell, Entry, Item, Line, NumberItem, Role, WordItem } from "./types";

export interface Tagged {
  item: WordItem | NumberItem;
  role: Role;
}

const MARKER_ROLES: Record<string, Role> = { not: "neg", plural: "plural", question: "question" };

/** Subject-verb-object roles by position: nominals before the first verb are subjects, after it objects. */
export function tagRoles(items: Item[]): Tagged[] {
  let seenVerb = false;
  const out: Tagged[] = [];
  for (const item of items) {
    if (item.kind === "number") {
      out.push({ item, role: "mod" });
      continue;
    }
    if (item.kind !== "word") continue;
    const { entry } = item;
    let role: Role;
    if (MARKER_ROLES[entry.id]) role = MARKER_ROLES[entry.id]!;
    else if (entry.pos === "verb") {
      role = "V";
      seenVerb = true;
    } else if (entry.pos === "adjective") role = "mod";
    else if (entry.pos === "other") role = "other";
    else role = seenVerb ? "O" : "S";
    out.push({ item, role });
  }
  return out;
}

export const cellOf = (
  entry: Entry,
  role: Role,
  source: string,
  options: { glyph?: string; copy?: boolean } = {},
): Cell => ({ glyph: options.glyph ?? entry.id, entry, role, copy: options.copy ?? false, source });

export function finishLine(items: Item[], cells: Cell[]): Line {
  const nominals = cells.filter((c) => c.role === "S" || c.role === "O").length;
  const hasVerb = cells.some((c) => c.role === "V");
  return { items, cells, warnings: nominals >= 2 && !hasVerb ? ["no-verb"] : [] };
}
