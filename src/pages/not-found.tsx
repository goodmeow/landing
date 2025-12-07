import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

import { CurrentTime } from "@/components/current-time";
import { ViewportSizeIndicator } from "@/components/viewport-size-indicator";
import { useBuildInfo } from "@/hooks/use-build-info";
import { useThemePreference } from "@/hooks/use-theme-preference";

const MotionSection = motion.section;
const IS_DEV = import.meta.env.DEV;

export default function NotFoundPage() {
  const { version, commitInfo } = useBuildInfo();
  const { theme, nextTheme, toggleTheme } = useThemePreference();

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
          <Link className="brand-overhead" to="/">
            goodmeow&apos;s blog
          </Link>
        </NavbarBrand>
        <NavbarContent className="navbar-overhead-actions" justify="center">
          <NavbarItem>
            <CurrentTime className="theme-clock" />
          </NavbarItem>
        </NavbarContent>
        <NavbarContent className="navbar-overhead-actions" justify="end">
          <NavbarItem className="theme-toggle-stack">
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

      <main className="not-found">
        <MotionSection
          animate={{ opacity: 1, y: 0 }}
          className="not-found-section"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="container">
            <Card className="not-found-card" radius="lg" shadow="lg">
              <CardBody className="not-found-card-body">
                <p className="not-found-eyebrow">Error 404</p>
                <h1>Looks like you took a wrong turn.</h1>
                <p className="not-found-copy">
                  The page you&apos;re after doesn&apos;t exist or might have
                  been moved. Let&apos;s get you back on track.
                </p>
                <div className="not-found-actions">
                  <Button
                    as={Link}
                    className="contact-button"
                    color="primary"
                    radius="full"
                    size="lg"
                    to="/"
                    variant="solid"
                  >
                    Go back home
                  </Button>
                  <Button
                    as="a"
                    className="contact-button"
                    disableRipple={false}
                    href="https://blog.goodmeow.my.id/"
                    radius="full"
                    size="lg"
                    variant="bordered"
                  >
                    Visit the blog
                  </Button>
                </div>
                <Divider className="not-found-divider" />
                <p className="not-found-tip">
                  Need to report an issue? Drop a line via{" "}
                  <a href="mailto:aarunalr@pm.me">email</a>.
                </p>
              </CardBody>
            </Card>
          </div>
        </MotionSection>
      </main>

      <footer className="site-footer">
        <div className="container">
          <Divider className="footer-divider" />
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
                <path d="M9.5 10.25a1.75 1.75 0 103.5 0 1.75 1.75 0 10-3.5 0z" />
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
