import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Link } from "react-router-dom";

import { ThemeToggle } from "@/components/theme-toggle";
import { useThemePreference } from "@/hooks/use-theme-preference";

const LINKS = [
  { label: "Gateway", to: "/stream" },
  { label: "Privacy", to: "/privacy" },
];

export function PageHeader() {
  const { theme, setTheme } = useThemePreference();

  return (
    <Navbar
      isBordered
      classNames={{
        base: "navbar-overhead-base navbar-shell",
        wrapper: "container navbar-overhead-wrapper",
      }}
    >
      <NavbarBrand>
        <Link className="brand-overhead" to="/">
          goodmeow.dev
        </Link>
      </NavbarBrand>
      <NavbarContent className="navbar-overhead-actions" justify="end">
        {LINKS.map((item) => (
          <NavbarItem key={item.to}>
            <Link className="page-nav-link" to={item.to}>
              {item.label}
            </Link>
          </NavbarItem>
        ))}
        <NavbarItem className="theme-toggle-stack">
          <ThemeToggle theme={theme} onThemeChange={setTheme} />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
