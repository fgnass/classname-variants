import { describe, expect, it } from "vitest";
import type { VariantsConfig } from "./index.js";
import { variantProps } from "./preact.js";

describe("preact adapter forwardProps", () => {
  it("forwards explicit variant values", () => {
    const config = {
      base: "btn",
      variants: {
        disabled: {
          true: "opacity-50",
        },
        size: {
          small: "text-sm",
          large: "text-lg",
        },
      },
      defaultVariants: {
        size: "small",
      },
      forwardProps: ["disabled"],
    } satisfies VariantsConfig<{
      disabled: { true: string };
      size: { small: string; large: string };
    }>;

    const mapProps = variantProps(config);

    const result = mapProps({
      disabled: true,
      size: "large",
      class: "custom",
    });

    expect(result.disabled).toBe(true);
    expect(result.class).toContain("btn");
    expect(result.class).toContain("opacity-50");
    expect(result.class).toContain("text-lg");
    expect(result.class).toContain("custom");
    expect("size" in result).toBe(false);
  });

  it("uses default variant values when forwarding", () => {
    const config = {
      base: "btn",
      variants: {
        disabled: {
          true: "opacity-50",
        },
      },
      defaultVariants: {
        disabled: true,
      },
      forwardProps: ["disabled"],
    } satisfies VariantsConfig<{
      disabled: { true: string };
    }>;

    const mapProps = variantProps(config);
    const result = mapProps({});

    expect(result.disabled).toBe(true);
    expect(result.class).toContain("opacity-50");
  });
});
