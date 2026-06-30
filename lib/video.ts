export function getEmbedUrl(videoUrl: string): string | null {
  try {
    const url = new URL(videoUrl);

    // YouTube: youtube.com/watch?v=ID or youtu.be/ID
    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }

    // Vimeo: vimeo.com/ID
    if (url.hostname.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }

    return null;
  } catch {
    return null;
  }
}

export function getYouTubeThumbnail(videoUrl: string): string | null {
  try {
    const url = new URL(videoUrl);
    let id: string | null = null;

    if (url.hostname.includes("youtube.com")) {
      id = url.searchParams.get("v");
    } else if (url.hostname === "youtu.be") {
      id = url.pathname.slice(1);
    }

    if (id) return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    return null;
  } catch {
    return null;
  }
}

export function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
