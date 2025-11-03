import type { Variants } from "framer-motion";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

import { NavButton } from "@/components/nav-button";
import {
  CredlyIcon,
  GithubIcon,
  LinktreeIcon,
  LinkedinIcon,
  ProtonMailIcon,
} from "@/components/contact-icons";
import { ViewportSizeIndicator } from "@/components/viewport-size-indicator";

const THEME_STORAGE_KEY = "gm-theme-preference";
const DEFAULT_GHOST_API_URL =
  "https://blog.goodmeow.my.id/ghost/api/content/posts/";
const DEFAULT_GHOST_CONTENT_KEY = "e7cb889602d27700ed32ade0c1";
const MotionSection = motion.section;
const IS_DEV = import.meta.env.DEV;

type ThemeMode = "light" | "dark";

type ThemeState = {
  theme: ThemeMode;
  manual: boolean;
};

type BlogPost = {
  title: string;
  url: string;
  date: string;
  isoDate: string;
  description: string;
  tags: string[];
};

type CommitInfo = {
  sha: string;
  url: string;
};

function useBuildVersion() {
  const [version, setVersion] = useState("");

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="x-build"]',
    );

    if (meta?.content) {
      setVersion(meta.content);
    }
  }, []);

  return version;
}

function formatDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function normaliseTags(
  tags: Array<string | { name?: string; slug?: string }> = [],
) {
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

function resolvePreferredTheme(): ThemeState {
  if (typeof window === "undefined") {
    return { theme: "dark", manual: false };
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (stored === "light" || stored === "dark") {
    return { theme: stored, manual: true };
  }

  const prefersLight = window.matchMedia?.(
    "(prefers-color-scheme: light)",
  ).matches;

  return { theme: prefersLight ? "light" : "dark", manual: false };
}

export default function IndexPage() {
  const version = useBuildVersion();
  const [{ theme, manual }, setThemeState] = useState<ThemeState>(
    resolvePreferredTheme,
  );
  const nextTheme: ThemeMode = theme === "light" ? "dark" : "light";
  const ghostContentUrl =
    import.meta.env.VITE_GHOST_CONTENT_URL?.trim() || DEFAULT_GHOST_API_URL;
  const ghostContentKey =
    import.meta.env.VITE_GHOST_CONTENT_KEY?.trim() || DEFAULT_GHOST_CONTENT_KEY;
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(
    Boolean(ghostContentKey),
  );
  const [postsErrored, setPostsErrored] = useState(false);

  const blogCardVariants = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, y: 16 },
      visible: { opacity: 1, y: 0 },
    }),
    [],
  );

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    if (typeof window !== "undefined") {
      if (manual) {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      } else {
        window.localStorage.removeItem(THEME_STORAGE_KEY);
      }
    }
  }, [theme, manual]);

  useEffect(() => {
    if (manual || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = (event: MediaQueryListEvent) => {
      setThemeState({ theme: event.matches ? "light" : "dark", manual: false });
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [manual]);

  useEffect(() => {
    if (!ghostContentKey) {
      setLoadingPosts(false);

      return;
    }

    setLoadingPosts(true);
    setPostsErrored(false);
    let ignore = false;
    const controller = new AbortController();

    async function loadPosts() {
      try {
        const url = new URL(ghostContentUrl || DEFAULT_GHOST_API_URL);

        url.searchParams.set("key", ghostContentKey);
        url.searchParams.set("limit", "3");
        url.searchParams.set("include", "tags");
        url.searchParams.set("fields", "title,url,excerpt,published_at");

        const response = await fetch(url, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Ghost Content API error: ${response.status} ${response.statusText}`,
          );
        }

        const payload: unknown = await response.json();
        const posts = Array.isArray((payload as { posts?: unknown })?.posts)
          ? ((payload as { posts: unknown[] }).posts as Array<
              Record<string, unknown>
            >)
          : [];

        if (!posts.length) return;

        const mapped = posts
          .map<BlogPost | null>((post) => {
            const title = typeof post?.title === "string" ? post.title : "";
            const urlValue = typeof post?.url === "string" ? post.url : "";
            const publishedAt =
              typeof post?.published_at === "string" ? post.published_at : "";
            const description =
              typeof post?.excerpt === "string" ? post.excerpt : "";
            const tags = Array.isArray(post?.tags)
              ? normaliseTags(
                  post.tags as Array<string | { name?: string; slug?: string }>,
                )
              : [];

            if (!title || !urlValue) return null;

            return {
              title,
              url: urlValue,
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

            return (
              new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
            );
          });

        if (!ignore && mapped.length) {
          setBlogPosts(mapped);
          setPostsErrored(false);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        if (!ignore) {
          setPostsErrored(true);
        }
        console.warn(
          "[IndexPage] Failed to fetch Ghost posts; showing empty list.",
          error,
        );
      } finally {
        if (!ignore) {
          setLoadingPosts(false);
        }
      }
    }

    void loadPosts();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [ghostContentKey, ghostContentUrl]);

  const toggleTheme = () => {
    setThemeState({ theme: nextTheme, manual: true });
  };

  const commitInfo = useMemo<CommitInfo | null>(() => {
    if (!version) return null;
    const parts = version.split("+");
    const sha = parts[1];

    if (!sha) return null;

    return {
      sha,
      url: `https://github.com/goodmeow/landing/commit/${sha}`,
    };
  }, [version]);

  return (
    <>
      <Navbar
        isBordered
        classNames={{
          base: "navbar-overhead-base navbar-shell",
          wrapper: "container navbar-overhead-wrapper",
        }}
      >
        <NavbarBrand>
          <a className="brand-overhead" href="#top">
            goodmeow&apos;s blog
          </a>
        </NavbarBrand>
        <NavbarContent className="navbar-overhead-actions" justify="end">
          <NavbarItem>
            <Button
              isIconOnly
              aria-label={`Switch to ${nextTheme} mode`}
              className="theme-toggle"
              disableRipple={false}
              radius="md"
              size="md"
              variant="ghost"
              onPress={toggleTheme}
            >
              {theme === "light" ? (
                <MoonIcon aria-hidden="true" focusable="false" />
              ) : (
                <SunIcon aria-hidden="true" focusable="false" />
              )}
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <Navbar
        isBordered
        shouldHideOnScroll
        classNames={{
          base: "navbar-base navbar-shell",
          wrapper: "container navbar-wrapper",
        }}
        position="sticky"
      >
        <Divider className="navbar-divider" />

        <NavbarContent
          aria-label="Primary navigation"
          className="navbar-row"
          justify="start"
        >
          <NavbarItem>
            <NavButton as="a" href="#blog">
              Blog
            </NavButton>
          </NavbarItem>
          <NavbarItem>
            <NavButton as="a" href="#about">
              About
            </NavButton>
          </NavbarItem>
          <NavbarItem>
            <NavButton as="a" href="#contact">
              Contact
            </NavButton>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main>
        <MotionSection
          animate={{ opacity: 1, y: 0 }}
          className="hero"
          id="top"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="container">
            <h1>Longlife Learner, Developer, &amp; Writer</h1>
            <p className="lead">
              I build useful things on the daily basis and write about tech,
              productivity, and what I learn along the way.
            </p>
            <div className="cta">
              <Button
                as="a"
                className="cta-accent"
                color="default"
                disableRipple={false}
                href="#blog"
                radius="full"
                size="md"
              >
                Read the Blog
              </Button>
            </div>
          </div>
        </MotionSection>

        <MotionSection
          className="section"
          id="blog"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1 }}
        >
          <div className="container">
            <div className="section-head">
              <h2>Latest Writing</h2>
              <a className="see-all" href="https://blog.goodmeow.my.id/">
                View all posts →
              </a>
            </div>
            <div className="grid cards">
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.url}
                  animate="visible"
                  className="blog-card-wrapper"
                  initial="hidden"
                  transition={{
                    duration: 0.35,
                    ease: "easeOut",
                    delay: index * 0.08,
                  }}
                  variants={blogCardVariants}
                >
                  <a
                    aria-label={`Read ${post.title}`}
                    className="blog-card-link"
                    href={post.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Card
                      isPressable
                      className="blog-card"
                      disableRipple={false}
                      radius="lg"
                      shadow="sm"
                    >
                      <CardHeader className="blog-card-header">
                        <div className="blog-card-title">
                          <h3>{post.title}</h3>
                          <p className="muted blog-card-date">
                            <time dateTime={post.isoDate ?? post.date}>
                              {post.date}
                            </time>
                          </p>
                        </div>
                      </CardHeader>
                      <CardBody className="blog-card-body">
                        <p className="blog-card-excerpt">{post.description}</p>
                      </CardBody>
                      {post.tags.length > 0 && (
                        <CardFooter className="blog-card-footer">
                          <div className="tags">
                            {post.tags.map((tag) => (
                              <Chip
                                key={tag}
                                className="tag-chip"
                                radius="full"
                                size="sm"
                                variant="flat"
                              >
                                {tag}
                              </Chip>
                            ))}
                          </div>
                        </CardFooter>
                      )}
                    </Card>
                  </a>
                </motion.div>
              ))}
            </div>
            {loadingPosts && (
              <p aria-live="polite" className="blog-status" role="status">
                Loading latest posts…
              </p>
            )}
            {!loadingPosts && blogPosts.length === 0 && (
              <p aria-live="polite" className="blog-status" role="status">
                {postsErrored
                  ? "Unable to load the latest posts right now."
                  : "No recent posts published yet."}{" "}
                <a
                  href="https://blog.goodmeow.my.id/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Visit the full blog
                </a>
                .
              </p>
            )}
          </div>
        </MotionSection>

        <section className="section" id="about">
          <div className="container">
            <Card isBlurred className="about-card" radius="lg" shadow="sm">
              <CardHeader className="about-card-header">
                <a
                  aria-label="View Gravatar profile"
                  className="avatar-link"
                  href="https://gravatar.com/3a273241dc4e42e7044c3fbc3ab24bf2"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div aria-hidden="true" className="avatar" />
                </a>
                <Divider className="about-divider" orientation="vertical" />
                <div>
                  <h2>About</h2>
                </div>
              </CardHeader>
              <CardBody className="about-card-body">
                <p>
                  Experienced Data Analyst with 3+ years in data-driven
                  decision-making, cross-functional project management, and
                  stakeholder collaboration. Passionate about leveraging
                  Business Intelligence tools to solve challenges in market
                  forecasting, supply chain optimization, and operational risk
                  mitigation.
                </p>
                <p>
                  Certified in AWS Cloud, SCRUM, and data visualization
                  (Tableau, SQL), with a proven ability to deliver actionable
                  insights for strategic planning in dynamic industry.
                </p>
              </CardBody>
            </Card>
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="container">
            <Card isBlurred className="contact-panel" radius="lg" shadow="lg">
              <CardBody className="contact-panel-body">
                <div className="contact-intro">
                  <h2>Let&apos;s catch up!</h2>
                  <p className="contact-lead">
                    This is where you can find me to work with.
                  </p>
                  <div className="contact-actions">
                    <Button
                      as="a"
                      className="contact-button"
                      disableRipple={false}
                      href="mailto:aarunalr@pm.me"
                      radius="full"
                      size="lg"
                      startContent={<ProtonMailIcon size={18} />}
                      variant="bordered"
                    >
                      Email me
                    </Button>
                    <Button
                      as="a"
                      className="contact-button"
                      disableRipple={false}
                      href="https://github.com/goodmeow"
                      radius="full"
                      size="lg"
                      startContent={<GithubIcon size={18} />}
                      variant="bordered"
                    >
                      GitHub
                    </Button>
                    <Button
                      as="a"
                      className="contact-button"
                      disableRipple={false}
                      href="https://www.credly.com/users/harun-al-rasyid.244a3d00"
                      radius="full"
                      size="lg"
                      startContent={<CredlyIcon size={18} />}
                      variant="bordered"
                    >
                      Credly
                    </Button>
                    <Button
                      as="a"
                      className="contact-button"
                      disableRipple={false}
                      href="https://www.linkedin.com/in/aarunalr"
                      radius="full"
                      size="lg"
                      startContent={<LinkedinIcon size={18} />}
                      variant="bordered"
                    >
                      LinkedIn
                    </Button>
                    <Button
                      as="a"
                      className="contact-button"
                      disableRipple={false}
                      href="https://linktr.ee/goodmeow"
                      radius="full"
                      size="lg"
                      startContent={<LinktreeIcon size={18} />}
                      variant="bordered"
                    >
                      Linktree
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p className="muted license">
            <a
              aria-label="Content licensed under CC BY-SA 4.0"
              className="license-badge"
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              rel="license noopener noreferrer"
              target="_blank"
            >
              <svg
                aria-hidden="true"
                fill="currentColor"
                height="16"
                viewBox="0 0 24 24"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 110-16 8 8 0 010 16z" />
                <path d="M9.5 10.25a1.75 1.75 0 103.5 0 1.75 1.75 0 10-3.5 0zm5.5 0a1.75 1.75 0 103.5 0 1.75 1.75 0 10-3.5 0z" />
                <path
                  d="M7 15.25c.9-1.2 2.5-2 5-2s4.1.8 5 2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              CC BY-SA 4.0
            </a>
            <span className="license-meta">
              <span aria-hidden="true">·</span>
              <span>v</span>
              {commitInfo ? (
                <a
                  aria-label={`View commit ${commitInfo.sha} on GitHub`}
                  href={commitInfo.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {version}
                </a>
              ) : (
                <span>{version}</span>
              )}
            </span>
            {IS_DEV ? <ViewportSizeIndicator /> : null}
          </p>
        </div>
      </footer>
    </>
  );
}
