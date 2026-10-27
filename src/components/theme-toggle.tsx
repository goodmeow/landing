import type { ThemeMode } from "@/hooks/use-theme-preference";

import { Button } from "@heroui/button";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

type ThemeToggleProps = {
  className?: string;
  labeled?: boolean;
  onThemeChange: (mode: ThemeMode) => void;
  theme: ThemeMode;
};

export function ThemeToggle({
  className,
  labeled = false,
  onThemeChange,
  theme,
}: ThemeToggleProps) {
  const segmentClass = className
    ? `theme-segment ${className}`
    : "theme-segment";
  const buttonClass = labeled
    ? "theme-toggle theme-toggle-labeled"
    : "theme-toggle";

  return (
    <div aria-label="Theme" className={segmentClass} role="group">
      <Button
        aria-label={labeled ? undefined : "Use light mode"}
        aria-pressed={theme === "light"}
        className={buttonClass}
        data-active={theme === "light"}
        isIconOnly={!labeled}
        radius="md"
        size="sm"
        startContent={
          labeled ? <SunIcon aria-hidden="true" focusable="false" /> : undefined
        }
        variant="light"
        onPress={() => onThemeChange("light")}
      >
        {labeled ? "Light" : <SunIcon aria-hidden="true" focusable="false" />}
      </Button>
      <Button
        aria-label={labeled ? undefined : "Use dark mode"}
        aria-pressed={theme === "dark"}
        className={buttonClass}
        data-active={theme === "dark"}
        isIconOnly={!labeled}
        radius="md"
        size="sm"
        startContent={
          labeled ? (
            <MoonIcon aria-hidden="true" focusable="false" />
          ) : undefined
        }
        variant="light"
        onPress={() => onThemeChange("dark")}
      >
        {labeled ? "Dark" : <MoonIcon aria-hidden="true" focusable="false" />}
      </Button>
    </div>
  );
}
