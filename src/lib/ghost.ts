export type BlogPost = {
  title: string;
  url: string;
  date: string;
  isoDate: string;
  description: string;
  tags: string[];
};

type GhostTag = string | { name?: string; slug?: string };

export function formatDate(dateString: string) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

export function normaliseTags(tags: GhostTag[] = []) {
  if (!Array.isArray(tags)) return [];

  return tags
    .map((tag) => {
      if (!tag) return "";
      if (typeof tag === "string") return tag;
      if (typeof tag?.name === "string") return tag.name;

      return tag?.slug ?? "";
    })
    .filter(Boolean);
}

export function parseGhostPosts(payload: unknown): BlogPost[] {
  const rawPosts = (payload as { posts?: unknown })?.posts;

  if (!Array.isArray(rawPosts)) return [];

  return rawPosts
    .map<BlogPost | null>((post) => {
      const record = post as Record<string, unknown> | null;
      const title = typeof record?.title === "string" ? record.title : "";
      const url = typeof record?.url === "string" ? record.url : "";
      const publishedAt =
        typeof record?.published_at === "string" ? record.published_at : "";
      const description =
        typeof record?.excerpt === "string" ? record.excerpt : "";
      const tags = Array.isArray(record?.tags)
        ? normaliseTags(record.tags as GhostTag[])
        : [];

      if (!title || !url) return null;

      return {
        title,
        url,
        date: formatDate(publishedAt),
        isoDate: publishedAt,
        description,
        tags,
      };
    })
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => {
      if (!a.isoDate) return 1;
      if (!b.isoDate) return -1;

      return new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime();
    });
}
