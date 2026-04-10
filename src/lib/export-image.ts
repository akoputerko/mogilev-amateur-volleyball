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

function getBgColor(): string {
  return `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--background").trim()})`;
}

/**
 * Primes html-to-image's internal CSS/font cache by doing one throwaway render.
 * Call once before rendering multiple sections so all subsequent renders are fast.
 */
export async function warmupRenderer(element: HTMLElement): Promise<void> {
  await toPng(element, { pixelRatio: 1, backgroundColor: getBgColor() });
}

/**
 * Renders an HTML section element to a PNG data URL (2x pixel ratio).
 * Uses html-to-image's onclone callback to add a header strip and replace
 * short team names with full names — the original DOM is never modified.
 * Assumes warmupRenderer has already been called.
 */
export async function renderSectionToImage(
  element: HTMLElement,
  title: string,
  teamMap: Record<string, string>,
): Promise<string> {
  const onclone = (_doc: Document, clone: HTMLElement) => {
    replaceShortNames(clone, teamMap);

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
    clone.parentElement?.insertBefore(header, clone);
  };

  return toPng(element, { pixelRatio: 2, backgroundColor: getBgColor(), onclone });
}

/**
 * Triggers a browser file download for a PNG from a data URL.
 */
export function downloadImage(dataUrl: string, filename: string): void {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
