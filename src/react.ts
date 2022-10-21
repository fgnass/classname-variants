import {
  ComponentProps,
  createElement,
  ElementType,
  forwardRef,
  ReactElement,
  Ref,
} from "react";

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
> = VariantOptions<C> & { className?: string };

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

    // Add the optionally passed className prop for chaining
    result.className = [props.className, variantClassName(props)]
      .filter(Boolean)
      .join(" ");

    return result as { className: string } & Omit<P, keyof C["variants"]>;
  };
}

type VariantsOf<T> = T extends VariantsConfig<infer V> ? V : {};

type AsProps<T extends ElementType = ElementType> = {
  as?: T;
};

type PolymorphicComponentProps<T extends ElementType> = AsProps<T> &
  Omit<ComponentProps<T>, "as">;

export function styled<
  T extends ElementType,
  C extends VariantsConfig<V>,
  V extends Variants = VariantsOf<C>
>(type: T, config: string | Simplify<C>) {
  const styledProps =
    typeof config === "string"
      ? variantProps({ base: config, variants: {} })
      : variantProps(config);

  const Component: <As extends ElementType = T>(
    props: PolymorphicComponentProps<As> & VariantOptions<C>
  ) => ReactElement | null = forwardRef(
    ({ as, ...props }: AsProps, ref: Ref<Element>) => {
      return createElement(as ?? type, { ...styledProps(props), ref });
    }
  );
  return Component;
}
