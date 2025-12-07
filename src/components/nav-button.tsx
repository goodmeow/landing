import type { ButtonProps } from "@heroui/button";

import { Button } from "@heroui/button";
import clsx from "clsx";
import { forwardRef } from "react";

type NavButtonProps = ButtonProps;

export const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
  (
    { className, radius = "full", size = "md", color = "default", ...props },
    ref,
  ) => (
    <Button
      ref={ref}
      className={clsx("nav-button", className)}
      color={color}
      radius={radius}
      size={size}
      {...props}
    />
  ),
);
NavButton.displayName = "NavButton";
