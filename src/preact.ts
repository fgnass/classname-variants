import { h } from "preact";
import type { JSX, Ref, ComponentType, ComponentProps, VNode } from "preact";
import { forwardRef } from "preact/compat";

type ElementType<P = any> = keyof JSX.IntrinsicElements | ComponentType<P>;

import {
  Variants,
  variants,
  VariantsConfig,
  VariantOptions,
  Simplify,
} from "./index.js";

/**
 * Utility type to infer the first argument of a variantProps function.
 */
export type VariantPropsOf<T> = T extends (props: infer P) => any ? P : never;

/**
 * Type for the variantProps() argument – consists of the VariantOptions and an optional className for chaining.
 */
type VariantProps<
  C extends VariantsConfig<V>,
  V extends Variants = C["variants"]
> = VariantOptions<C> & { class?: string; className?: string };

export function variantProps<
  C extends VariantsConfig<V>,
  V extends Variants = C["variants"]
>(config: Simplify<C>) {
  const variantClassName = variants<C>(config);
  return <P extends VariantProps<C>>(props: P) => {
    const result: any = {};

    // Pass-through all unrelated props
    for (let prop in props) {
      if (config.variants && !(prop in config.variants)) {
        result[prop] = props[prop];
      }
    }

    // Add the optionally passed class/className prop for chaining
    result.class = [variantClassName(props), props.class, props.className]
      .filter(Boolean)
      .join(" ");

    return result as { class: string } & Omit<P, keyof C["variants"]>;
  };
}

type VariantsOf<T, V> = T extends VariantsConfig ? V : {};

type AsProps<T extends ElementType = ElementType> = {
  as?: T;
};

type PolymorphicComponentProps<T extends ElementType> = AsProps<T> &
  Omit<ComponentProps<T>, "as">;

export function styled<
  T extends ElementType,
  C extends VariantsConfig<V>,
  V extends Variants = VariantsOf<C, C["variants"]>
>(type: T, config: string | Simplify<C>) {
  const styledProps =
    typeof config === "string"
      ? variantProps({ base: config, variants: {} })
      : variantProps(config);

  const Component: <As extends ElementType = T>(
    props: PolymorphicComponentProps<As> & VariantOptions<C>
  ) => VNode | null = forwardRef(
    ({ as, ...props }: AsProps, ref: Ref<Element>) => {
      return h(as ?? (type as any), { ...styledProps(props), ref });
    }
  );
  return Component;
}

/**
 * No-op function to mark template literals as tailwind strings.
 */
export const tw = String.raw;
