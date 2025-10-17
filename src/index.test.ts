import { describe, expect, it } from "vitest";

import { classNames, tw, type VariantsConfig, variants } from "./index.js";

describe("classNames.combine", () => {
  it("joins truthy values with spaces", () => {
    expect(classNames.combine("foo", undefined, "bar", false, "baz")).toBe(
      "foo bar baz",
    );
  });

  it("returns empty string for falsy input", () => {
    expect(classNames.combine(undefined, null, false, 0)).toBe("");
  });
});

describe("tw helper", () => {
  it("returns raw template strings", () => {
    expect(tw`foo`).toBe("foo");
    const dynamic = "bar";
    expect(tw`foo-${dynamic}`).toBe("foo-bar");
  });
});

describe("variants factory", () => {
  const config = {
    base: "btn",
    variants: {
      tone: {
        neutral: "text-neutral",
        accent: "text-accent",
      },
      size: {
        small: "text-sm",
        large: "text-lg",
      },
      disabled: {
        true: "opacity-50",
        false: "opacity-100",
      },
    },
    defaultVariants: {
      tone: "neutral",
      size: "small",
    },
    compoundVariants: [
      {
        variants: { tone: "accent", size: "large" },
        className: "text-accent-large",
      },
      {
        variants: { disabled: true },
        className: "pointer-events-none",
      },
    ],
  } satisfies VariantsConfig<{
    tone: { neutral: string; accent: string };
    size: { small: string; large: string };
    disabled: { true: string; false: string };
  }>;

  const button = variants(config);

  it("includes base class", () => {
    expect(button({ tone: "neutral", size: "small" })).toContain("btn");
  });

  it("uses default variants when omitted", () => {
    const result = button({});
    expect(result).toContain("text-neutral");
    expect(result).toContain("text-sm");
    expect(result).not.toContain("text-lg");
  });

  it("applies boolean variants with false default", () => {
    const result = button({});
    expect(result).toContain("opacity-100");
  });

  it("prefers explicit props over defaults", () => {
    const result = button({ tone: "accent", size: "large" });
    expect(result).toContain("text-accent");
    expect(result).toContain("text-lg");
    expect(result).not.toContain("text-neutral");
    expect(result).not.toContain("text-sm");
  });

  it("handles boolean true variants", () => {
    const result = button({ disabled: true });
    expect(result).toContain("opacity-50");
    expect(result).toContain("pointer-events-none");
  });

  it("runs compound variants only when all predicates match", () => {
    const accentLarge = button({ tone: "accent", size: "large" });
    expect(accentLarge).toContain("text-accent-large");

    const accentSmall = button({ tone: "accent", size: "small" });
    expect(accentSmall).not.toContain("text-accent-large");
  });

  it("accepts boolean variants via explicit false", () => {
    const result = button({ disabled: false });
    expect(result).toContain("opacity-100");
    expect(result).not.toContain("pointer-events-none");
  });

  it("keeps default class when variant explicitly undefined", () => {
    const result = button({ tone: undefined, size: "large" });
    expect(result).toContain("text-lg");
    expect(result).toContain("text-neutral");
    expect(result).not.toContain("text-accent");
  });
});
