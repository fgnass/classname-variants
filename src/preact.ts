import type { ComponentProps, ComponentType, JSX, Ref, VNode } from "preact";
import { h } from "preact";
import { forwardRef } from "preact/compat";

type ElementType<P = any> = keyof JSX.IntrinsicElements | ComponentType<P>;

import {
  classNames,
  type Simplify,
  type VariantOptions,
  type Variants,
  type VariantsConfig,
  variants,
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
  V extends Variants = C["variants"],
> = VariantOptions<C> & { class?: string; className?: string };

export function variantProps<
  C extends VariantsConfig<V>,
  V extends Variants = C["variants"],
>(config: Simplify<C>) {
  const variantClassName = variants<C>(config);
  return <P extends VariantProps<C>>(props: P) => {
    const result: any = {};

    // Pass-through all unrelated props
    for (const prop in props) {
      if (config.variants && !(prop in config.variants)) {
        result[prop] = props[prop];
      }
    }

    // Add the optionally passed class/className prop for chaining
    result.class = classNames.combine(
      variantClassName(props),
      props.class,
      props.className,
    );

    return result as { class: string } & Omit<P, keyof C["variants"]>;
  };
}

type VariantsOf<T, V> = T extends VariantsConfig ? V : {};

type AsProps<T extends ElementType = ElementType> = {
  as?: T;
};

type CleanDefaults<Defaults> = Exclude<Defaults, undefined>;
type DefaultedKeys<Props, Defaults> = Extract<
  keyof CleanDefaults<Defaults>,
  keyof Props
>;

type WithDefaultProps<Props, Defaults> = [CleanDefaults<Defaults>] extends [
  never,
]
  ? Props
  : Omit<Props, DefaultedKeys<Props, Defaults>> &
      Partial<Pick<Props, DefaultedKeys<Props, Defaults>>>;

type PolymorphicComponentProps<V, T extends ElementType> = AsProps<T> &
  Omit<ComponentProps<T>, "as" | keyof V> &
  V;

export function styled<
  T extends ElementType,
  C extends VariantsConfig<V>,
  V extends Variants = VariantsOf<C, C["variants"]>,
  Defaults extends Partial<ComponentProps<T>> | undefined = undefined,
>(
  type: T,
  config:
    | string
    | { base: string; defaultProps?: Defaults }
    | (Simplify<C> & { defaultProps?: Defaults }),
): <As extends ElementType = T>(
  props: WithDefaultProps<
    PolymorphicComponentProps<
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
    >,
    Defaults
  >,
) => VNode | null {
  const styledProps =
    typeof config === "string"
      ? variantProps({ base: config, variants: {} })
      : "variants" in (config as Exclude<typeof config, string>)
        ? variantProps(config as Simplify<C>)
        : variantProps({
            base: (config as Exclude<typeof config, string> & { base: string })
              .base,
            variants: {},
          });

  const defaultProps =
    typeof config === "string" ? undefined : (config.defaultProps as Defaults);

  const toRecord = (value: unknown): Record<string, unknown> =>
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  const readClass = (value: unknown) =>
    typeof value === "string" ? value : undefined;

  const Component = forwardRef(
    (
      { as, ...props }: AsProps & Record<string, unknown>,
      ref: Ref<Element>,
    ) => {
      const defaultsRecord = toRecord(defaultProps);
      const propsRecord = props;

      const merged = {
        ...defaultsRecord,
        ...propsRecord,
      } as VariantPropsOf<typeof styledProps> & Record<string, unknown>;

      merged.class = classNames.combine(
        readClass(defaultsRecord.class),
        readClass(propsRecord.class),
      );

      merged.className = classNames.combine(
        readClass(defaultsRecord.className),
        readClass(propsRecord.className),
      );

      return h(as ?? (type as any), { ...styledProps(merged), ref });
    },
  ) as <As extends ElementType = T>(
    props: WithDefaultProps<
      PolymorphicComponentProps<
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
      >,
      Defaults
    >,
  ) => VNode | null;
  return Component;
}

/**
 * No-op function to mark template literals as tailwind strings.
 */
export const tw = String.raw;
