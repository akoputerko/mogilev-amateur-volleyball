// src/lib/export-image.ts
import { toPng } from "html-to-image";

/**
 * Replaces text nodes that exactly match a team short name with the full name.
 * Only trims and compares — no partial/substring replacement.
 * teamMap example: { "МАК": "Макиато", "DRM": "Dream Team" }
 */
function replaceShortNames(element: HTMLElement, teamMap: Record<string, string>): void {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode()) !== null) {
    textNodes.push(node as Text);
  }
  for (const textNode of textNodes) {
    const trimmed = textNode.nodeValue?.trim() ?? "";
    if (trimmed in teamMap) {
      textNode.nodeValue = teamMap[trimmed];
    }
  }
}

/**
 * Wraps a cloned section in a styled offscreen container.
 * Uses CSS variables so dark/light theme is respected automatically.
 */
function buildWrapper(clone: HTMLElement, title: string): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = [
    "position: absolute",
    "left: -9999px",
    "top: 0",
    "width: 800px",
    "background: hsl(var(--background))",
    "color: hsl(var(--foreground))",
    "padding: 20px",
    "border-radius: 12px",
    "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  ].join("; ");

  const header = document.createElement("div");
  header.style.cssText = [
    "font-size: 11px",
    "text-transform: uppercase",
    "letter-spacing: 0.08em",
    "color: hsl(var(--muted-foreground))",
    "margin-bottom: 12px",
    "font-weight: 600",
  ].join("; ");
  header.textContent = `Могилёвская лига • ${title}`;

  wrapper.appendChild(header);
  wrapper.appendChild(clone);
  return wrapper;
}

/**
 * Renders an HTML section element to a PNG data URL (2x pixel ratio).
 * Clones the element, replaces team short names with full names in the clone,
 * wraps in a styled 800px offscreen container, renders, then removes container.
 */
export async function renderSectionToImage(
  element: HTMLElement,
  title: string,
  teamMap: Record<string, string>,
): Promise<string> {
  const clone = element.cloneNode(true) as HTMLElement;
  replaceShortNames(clone, teamMap);
  const wrapper = buildWrapper(clone, title);
  document.body.appendChild(wrapper);
  try {
    return await toPng(wrapper, { pixelRatio: 2 });
  } finally {
    document.body.removeChild(wrapper);
  }
}

/**
 * Triggers a browser file download for a PNG from a data URL.
 */
export function downloadImage(dataUrl: string, filename: string): void {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
