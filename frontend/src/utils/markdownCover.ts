export interface ParsedMarkdown {
  frontmatter: Record<string, unknown>;
  body: string;
}

/**
 * Minimal frontmatter + body splitter.
 *
 * Supports content starting with:
 *
 * ---
 * key: value
 * cover: "https://..."
 * tags: [a, b]
 * ---
 *
 * Returns the parsed frontmatter (string / string[] values) and the remaining body.
 */
export function parseFrontmatterAndBody(markdown: string): ParsedMarkdown {
  if (!markdown.trimStart().startsWith("---")) {
    return { frontmatter: {}, body: markdown };
  }

  const lines = markdown.split(/\r?\n/);
  if (lines[0].trim() !== "---") {
    return { frontmatter: {}, body: markdown };
  }

  let endIndex = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === "---") {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    // No closing ---; treat as normal markdown
    return { frontmatter: {}, body: markdown };
  }

  const rawFrontmatterLines = lines.slice(1, endIndex);
  const frontmatter: Record<string, unknown> = {};

  for (const rawLine of rawFrontmatterLines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Strip wrapping quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Very light array syntax support: [a, b, c]
    if (value.startsWith("[") && value.endsWith("]")) {
      const inner = value.slice(1, -1).trim();
      frontmatter[key] = inner
        ? inner.split(",").map((part) => part.trim().replace(/^['"]|['"]$/g, ""))
        : [];
    } else {
      frontmatter[key] = value;
    }
  }

  const body = lines.slice(endIndex + 1).join("\n");
  return { frontmatter, body };
}

export function extractFirstImageFromMarkdown(body: string): string | null {
  if (!body) return null;

  // 1) Standard markdown image: ![alt](url)
  const mdImageRegex = /!\[[^\]]*]\((?<url>[^)\s]+)[^)]*\)/;
  const mdMatch = body.match(mdImageRegex);
  const mdUrl = mdMatch && (mdMatch.groups?.url || mdMatch[1]);
  if (mdUrl && typeof mdUrl === "string") {
    return mdUrl.trim();
  }

  // 2) Simple <img src="..."> tag
  const htmlImgRegex = /<img[^>]*\s+src=["']([^"'>\s]+)["'][^>]*>/i;
  const htmlMatch = body.match(htmlImgRegex);
  if (htmlMatch && htmlMatch[1]) {
    return htmlMatch[1].trim();
  }

  return null;
}

export function getCoverUrlFromContent(fullMarkdown: string | null | undefined): string | null {
  if (!fullMarkdown) return null;

  const { frontmatter, body } = parseFrontmatterAndBody(fullMarkdown);
  const rawCover = frontmatter.cover as unknown;

  if (typeof rawCover === "string") {
    const trimmed = rawCover.trim();
    if (trimmed) return trimmed;
  }

  return extractFirstImageFromMarkdown(body);
}

