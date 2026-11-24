import { afterEach, describe, expect, it, vi } from "vitest";

import { resolvePreferredTheme } from "./use-theme-preference";

describe("resolvePreferredTheme", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("falls back to dark without crashing when localStorage throws", () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem() {
          throw new Error("SecurityError");
        },
      },
      matchMedia: () => ({ matches: false }),
    });

    expect(resolvePreferredTheme()).toEqual({ theme: "dark", manual: false });
  });

  it("uses stored preference when available", () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => "light",
      },
      matchMedia: () => ({ matches: false }),
    });

    expect(resolvePreferredTheme()).toEqual({ theme: "light", manual: true });
  });

  it("follows system light preference when nothing is stored", () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => null,
      },
      matchMedia: () => ({ matches: true }),
    });

    expect(resolvePreferredTheme()).toEqual({ theme: "light", manual: false });
  });
});
