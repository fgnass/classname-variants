import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { VariantsConfig } from "./index.js";
import { styled, variantProps } from "./react.js";

describe("react adapter forwardProps", () => {
  it("forwards explicit variant values", () => {
    const config = {
      base: "btn",
      variants: {
        disabled: {
          true: "opacity-50",
        },
        tone: {
          neutral: "text-slate-700",
          accent: "text-teal-600",
        },
      },
      defaultVariants: {
        tone: "neutral",
      },
      forwardProps: ["disabled"],
    } satisfies VariantsConfig<{
      disabled: { true: string };
      tone: { neutral: string; accent: string };
    }>;

    const mapProps = variantProps(config);

    const result = mapProps({
      disabled: true,
      tone: "accent",
      className: "custom",
    });

    expect(result.disabled).toBe(true);
    expect(result.className).toContain("btn");
    expect(result.className).toContain("opacity-50");
    expect(result.className).toContain("text-teal-600");
    expect(result.className).toContain("custom");
    expect("tone" in result).toBe(false);
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
        disabled: true as const,
      },
      forwardProps: ["disabled"],
    } satisfies VariantsConfig<{
      disabled: { true: string };
    }>;

    const mapProps = variantProps(config);
    const result = mapProps({});

    expect(result.disabled).toBe(true);
    expect(result.className).toContain("opacity-50");
  });

  it("renders forwarded props through styled components", () => {
    const buttonConfig = {
      base: "btn",
      variants: {
        disabled: {
          true: "opacity-50",
        },
      },
      forwardProps: ["disabled"],
    } satisfies VariantsConfig<{
      disabled: { true: string };
    }>;

    const Button = styled("button", buttonConfig);

    const markup = renderToStaticMarkup(
      React.createElement(Button, {
        className: "custom",
        disabled: true,
      }),
    );

    const host = document.createElement("div");
    host.innerHTML = markup;
    const button = host.querySelector("button");

    expect(button).not.toBeNull();
    expect(button!.hasAttribute("disabled")).toBe(true);
    expect(button!.className).toContain("btn");
    expect(button!.className).toContain("opacity-50");
    expect(button!.className).toContain("custom");
  });
});
