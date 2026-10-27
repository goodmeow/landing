import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

import { CurrentTime } from "@/components/current-time";
import { SiteFooter } from "@/components/site-footer";
import { useThemePreference } from "@/hooks/use-theme-preference";

const MotionSection = motion.section;

export default function NotFoundPage() {
  const { theme, setTheme } = useThemePreference();

  useEffect(() => {
    document.title = "Page Not Found | goodmeow.dev";
  }, []);

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

      <SiteFooter />
    </>
  );
}
