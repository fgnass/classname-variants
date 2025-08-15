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
  classNames,
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
    result.className = classNames.combine(
      variantClassName(props),
      props.className
    );

    return result as { className: string } & Omit<P, keyof C["variants"]>;
  };
}

type VariantsOf<T, V> = T extends VariantsConfig ? V : {};

type AsProps<T extends ElementType = ElementType> = {
  as?: T;
};

type PolymorphicComponentProps<V, T extends ElementType> = AsProps<T> &
  Omit<ComponentProps<T>, "as" | keyof V> &
  V;

export function styled<
  T extends ElementType,
  C extends VariantsConfig<V>,
  V extends Variants = VariantsOf<C, C["variants"]>
>(
  type: T,
  config: string | { base: string } | Simplify<C>
): <As extends ElementType = T>(
  props: PolymorphicComponentProps<
    typeof config extends string
      ? {}
      : typeof config extends {
          base: string;
          variants?: undefined;
          compoundVariants?: undefined;
          defaultVariants?: undefined;
        }
      ? {}
      : VariantOptions<C>,
    As
  >
) => ReactElement | null {
  const styledProps =
    typeof config === "string"
      ? variantProps({ base: config, variants: {} })
      : "variants" in config
      ? variantProps(config as Simplify<C>)
      : variantProps({ base: config.base, variants: {} });

  const Component: <As extends ElementType = T>(
    props: PolymorphicComponentProps<
      typeof config extends string
        ? {}
        : typeof config extends {
            base: string;
            variants?: undefined;
            compoundVariants?: undefined;
            defaultVariants?: undefined;
          }
        ? {}
        : VariantOptions<C>,
      As
    >
  ) => ReactElement | null = forwardRef(
    ({ as, ...props }: AsProps, ref: Ref<Element>) => {
      return createElement(as ?? type, { ...styledProps(props), ref });
    }
  );
  return Component;
}

/**
 * No-op function to mark template literals as tailwind strings.
 */
export const tw = String.raw;
