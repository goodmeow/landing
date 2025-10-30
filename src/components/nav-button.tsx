import type { ButtonProps } from "@heroui/button";

import { Button } from "@heroui/button";
import clsx from "clsx";
import { forwardRef } from "react";

type NavButtonProps = ButtonProps;

export const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
  (
    { className, radius = "md", size = "md", color = "secondary", ...props },
    ref,
  ) => (
    <Button
      ref={ref}
      className={clsx(
        "flex items-center justify-start gap-3 px-5 py-2 text-sm font-semibold tracking-wide text-left",
        "shadow-lg shadow-secondary/45 bg-secondary text-secondary-foreground transition-transform-colors",
        "data-[hover=true]:shadow-secondary/60 data-[hover=true]:bg-secondary/95 data-[hover=true]:-translate-y-0.5 data-[pressed=true]:translate-y-0",
        "data-[focus-visible=true]:outline-none data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-secondary/60 data-[focus-visible=true]:ring-offset-2 data-[focus-visible=true]:ring-offset-background",
        className,
      )}
      color={color}
      radius={radius}
      size={size}
      {...props}
    />
  ),
);
NavButton.displayName = "NavButton";
