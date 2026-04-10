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
 * Renders an HTML section element to a PNG data URL (2x pixel ratio).
 * Uses html-to-image's onclone callback to add a header strip and replace
 * short team names with full names in the internally-managed clone, so the
 * original DOM is never modified.
 *
 * The first toPng call warms up external CSS inlining; the second captures
 * the fully styled result.
 */
export async function renderSectionToImage(
  element: HTMLElement,
  title: string,
  teamMap: Record<string, string>,
): Promise<string> {
  const bg = getComputedStyle(document.documentElement).getPropertyValue("--background").trim();

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

  const options = { pixelRatio: 2, backgroundColor: `hsl(${bg})`, onclone };
  await toPng(element, options);
  return toPng(element, options);
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
