import type { Variants } from "framer-motion";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { CurrentTime } from "@/components/current-time";
import { NavButton } from "@/components/nav-button";
import {
  CredlyIcon,
  GithubIcon,
  LinktreeIcon,
  LinkedinIcon,
  ProtonMailIcon,
} from "@/components/contact-icons";
import { SiteFooter } from "@/components/site-footer";
import { useThemePreference } from "@/hooks/use-theme-preference";
import { parseGhostPosts, type BlogPost } from "@/lib/ghost";

const DEFAULT_GHOST_API_URL =
  "https://blog.goodmeow.my.id/ghost/api/content/posts/";
const MotionSection = motion.section;
const PAGE_TITLE = "goodmeow.dev — IT Ops, Monitoring & Networking Notes";
const NAV_ITEMS = [
  { label: "Blog", href: "#blog" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function IndexPage() {
  const { theme, setTheme } = useThemePreference();
  const ghostContentUrl =
    import.meta.env.VITE_GHOST_CONTENT_URL?.trim() || DEFAULT_GHOST_API_URL;
  const ghostContentKey = import.meta.env.VITE_GHOST_CONTENT_KEY?.trim() ?? "";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

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
        const mapped = parseGhostPosts(payload);

        if (!ignore && mapped.length) {
          setBlogPosts(mapped);
          setPostsErrored(false);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        if (!ignore) {
          // eslint-disable-next-line no-console -- Ghost failures are otherwise invisible
          console.error("Failed to load Ghost posts", error);
          setPostsErrored(true);
        }
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

  return (
    <>
      <Navbar
        isBordered
        shouldHideOnScroll
        classNames={{
          base: "navbar-base",
          wrapper: "container docs-navbar-wrapper",
          menu: "docs-navbar-menu",
          menuItem: "docs-navbar-menu-item",
        }}
        isMenuOpen={isMenuOpen}
        position="sticky"
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent className="docs-navbar-toggle" justify="start">
          <NavbarMenuToggle
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            icon={(open: boolean) =>
              open ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )
            }
          />
        </NavbarContent>
        <NavbarBrand className="docs-navbar-brand">
          <a className="brand-overhead" href="#top" onClick={closeMenu}>
            <span className="brand-mark">gm</span>
            <span className="brand-copy">
              <span>goodmeow.dev</span>
              <small>ops notes</small>
            </span>
          </a>
        </NavbarBrand>
        <NavbarContent
          aria-label="Primary navigation"
          className="docs-navbar-links"
          justify="center"
        >
          {NAV_ITEMS.map((item) => (
            <NavbarItem key={item.href}>
              <NavButton as="a" href={item.href}>
                {item.label}
              </NavButton>
            </NavbarItem>
          ))}
        </NavbarContent>
        <NavbarContent className="docs-navbar-tools" justify="end">
          <NavbarItem>
            <a className="docs-search" href="#blog">
              <MagnifyingGlassIcon aria-hidden="true" focusable="false" />
              <span>Browse posts</span>
            </a>
          </NavbarItem>
          <NavbarItem>
            <div aria-label="Theme" className="theme-segment" role="group">
              <Button
                isIconOnly
                aria-label="Use light mode"
                aria-pressed={theme === "light"}
                className="theme-toggle"
                data-active={theme === "light"}
                radius="md"
                size="sm"
                variant="light"
                onPress={() => setTheme("light")}
              >
                <SunIcon aria-hidden="true" focusable="false" />
              </Button>
              <Button
                isIconOnly
                aria-label="Use dark mode"
                aria-pressed={theme === "dark"}
                className="theme-toggle"
                data-active={theme === "dark"}
                radius="md"
                size="sm"
                variant="light"
                onPress={() => setTheme("dark")}
              >
                <MoonIcon aria-hidden="true" focusable="false" />
              </Button>
            </div>
          </NavbarItem>
          <NavbarItem className="docs-navbar-clock">
            <CurrentTime className="theme-clock" />
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu>
          {NAV_ITEMS.map((item) => (
            <NavbarMenuItem key={item.href}>
              <a
                className="docs-menu-link"
                href={item.href}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem>
            <a className="docs-menu-search" href="#blog" onClick={closeMenu}>
              <MagnifyingGlassIcon aria-hidden="true" focusable="false" />
              <span>Browse posts</span>
            </a>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <div
              aria-label="Theme"
              className="theme-segment theme-segment-mobile"
              role="group"
            >
              <Button
                aria-pressed={theme === "light"}
                className="theme-toggle theme-toggle-labeled"
                data-active={theme === "light"}
                radius="md"
                size="sm"
                startContent={<SunIcon aria-hidden="true" focusable="false" />}
                variant="light"
                onPress={() => setTheme("light")}
              >
                Light
              </Button>
              <Button
                aria-pressed={theme === "dark"}
                className="theme-toggle theme-toggle-labeled"
                data-active={theme === "dark"}
                radius="md"
                size="sm"
                startContent={<MoonIcon aria-hidden="true" focusable="false" />}
                variant="light"
                onPress={() => setTheme("dark")}
              >
                Dark
              </Button>
            </div>
          </NavbarMenuItem>
        </NavbarMenu>
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
            <h1>IT Operations, Monitoring, and Developer Notes</h1>
            <p className="lead">
              goodmeow.dev is the personal notebook of Harun Al Rasyid, covering
              infrastructure reliability, Docker, Linux, monitoring, automation,
              and lessons from day-to-day IT operations work.
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
                  <Card
                    isPressable
                    aria-label={`Read ${post.title}`}
                    as="a"
                    className="blog-card blog-card-link"
                    disableRipple={false}
                    href={post.url}
                    radius="lg"
                    rel="noopener noreferrer"
                    shadow="sm"
                    target="_blank"
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
                  IT Infrastructure Engineer with hands-on Data Center and
                  enterprise networking experience — currently serving as the
                  infrastructure focal point for a corporate office building,
                  driving day-to-day IT operations and enterprise network
                  implementation.
                </p>
                <p>
                  Designed and implemented MikroTik CRS354 as the Data Center
                  Layer-3 routing platform, integrating Hyper-V infrastructure,
                  enterprise servers, and FortiGate 401F. Planned and executed
                  VLAN segmentation, IP addressing, gateway migration, and
                  inter-VLAN routing. Collaborated on Cisco Catalyst 9300 and
                  Aruba CX switching deployment.
                </p>
                <p>
                  Deployed Zabbix monitoring on Ubuntu Linux with SLA
                  availability reporting, built Windows DNS Split-DNS
                  architecture, and administered Microsoft 365 services
                  including Exchange Online, Purview, and eDiscovery.
                </p>
                <p>
                  This site collects practical notes on MikroTik routing,
                  FortiGate, monitoring, incident response, Docker, Linux
                  servers, and automation patterns useful for keeping production
                  systems understandable and reliable.
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

      <SiteFooter />
    </>
  );
}
