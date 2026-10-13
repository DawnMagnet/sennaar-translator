type Child = Node | string | null | undefined | false;
type Attrs = Record<string, string | number | boolean | EventListener | null | undefined>;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs | null = null,
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs ?? {})) {
    if (value == null || value === false) continue;
    if (typeof value === "function") el.addEventListener(name.slice(2).toLowerCase(), value);
    else el.setAttribute(name, value === true ? "" : String(value));
  }
  for (const child of children) if (child) el.append(child);
  return el;
}

export const clear = (el: Element) => el.replaceChildren();

/** Parse trusted, static SVG/HTML markup (never user input) into an element. */
export function fromMarkup(markup: string): Element {
  const template = document.createElement("template");
  template.innerHTML = markup.trim();
  return template.content.firstElementChild!;
}
