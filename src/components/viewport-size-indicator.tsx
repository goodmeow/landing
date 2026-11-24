import { useMemo } from "react";
import { useViewportSize } from "@heroui/use-viewport-size";

export function ViewportSizeIndicator() {
  const { width, height } = useViewportSize();

  const label = useMemo(() => {
    if (!width || !height) {
      return "viewport —";
    }

    const roundedWidth = Math.round(width);
    const roundedHeight = Math.round(height);

    return `viewport ${roundedWidth} × ${roundedHeight}`;
  }, [width, height]);

  return (
    <span
      aria-live="polite"
      className="viewport-indicator license-badge"
      role="status"
    >
      {label}
    </span>
  );
}
