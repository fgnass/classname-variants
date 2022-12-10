/**
 * Definition of the available variants and their options.
 * @example
 * {
 *   color: {
 *     white: "bg-white"
 *     green: "bg-green-500",
 *   },
 *   size: {
 *     small: "text-xs",
 *     large: "text-lg"
 *   }
 * }
 */
export type Variants = Record<string, Record<string, string>>;

/**
 * Configuration including defaults and compound variants.
 */
export interface VariantsConfig<V extends Variants = {}> {
  base?: string;
  variants: V;
  compoundVariants?: CompoundVariant<V>[];
  defaultVariants?: Partial<OptionsOf<V>>;
}

/**
 * Rules for class names that are applied for certain variant combinations.
 */
export interface CompoundVariant<V extends Variants> {
  variants: Partial<OptionsOf<V>>;
  className: string;
}

/**
 * Only the boolean variants, i.e. ones that have "true" or "false" as options.
 */
type BooleanVariants<V extends Variants> = {
  [K in keyof V as V[K] extends { true: any } | { false: any }
    ? K
    : never]: V[K];
};

/**
 * Only the variants for which a default options is set.
 */
type DefaultVariants<
  C extends VariantsConfig<V>,
  V extends Variants = C["variants"]
> = {
  [K in keyof V as K extends keyof C["defaultVariants"]
    ? K
    : never]: C["variants"][K];
};

/**
 * Names of all optional variants, i.e. booleans or ones with default options.
 */
type OptionalVariantNames<
  C extends VariantsConfig<V>,
  V extends Variants = C["variants"]
> = keyof BooleanVariants<V> | keyof DefaultVariants<C>;

/**
 * Possible options for all the optional variants.
 *
 * @example
 * {
 *   color?: "white" | "green",
 *   rounded?: boolean | undefined
 * }
 */
type OptionalOptions<
  C extends VariantsConfig<V>,
  V extends Variants = C["variants"]
> = {
  [K in keyof V as K extends OptionalVariantNames<C>
    ? K
    : never]?: OptionsOf<V>[K];
};

/**
 * Possible options for all required variants.
 *
 * @example {
 *   size: "small" | "large"
 * }
 */
type RequiredOptions<
  C extends VariantsConfig<V>,
  V extends Variants = C["variants"]
> = {
  [K in keyof V as K extends OptionalVariantNames<C>
    ? never
    : K]: OptionsOf<V>[K];
};

/**
 * Utility type to extract the possible options.
 * Converts "true" | "false" options into booleans.
 *
 * @example
 * OptionsOf<{
 *   size: { small: "text-xs"; large: "text-lg" };
 *   rounded: { true: "rounded-full" }
 * }>
 * ==>
 * {
 *   size: "text-xs" | "text-lg";
 *   rounded: boolean;
 * }
 */
type OptionsOf<V extends Variants> = {
  [K in keyof V]: keyof V[K] extends "true" | "false" ? boolean : keyof V[K];
};

/**
 * Extracts the possible options.
 */
export type VariantOptions<
  C extends VariantsConfig<V>,
  V extends Variants = C["variants"]
> = RequiredOptions<C> & OptionalOptions<C>;

/**
 * Without this conversion step, defaultVariants and compoundVariants will
 * allow extra keys, i.e. non-existent variants.
 * See https://github.com/sindresorhus/type-fest/blob/main/source/simplify.d.ts
 */
export type Simplify<T> = {
  [K in keyof T]: T[K];
};

export function variants<
  C extends VariantsConfig<V>,
  V extends Variants = C["variants"]
>(config: Simplify<C>) {
  const { base, variants, compoundVariants, defaultVariants } = config;

  const isBooleanVariant = (name: keyof V) => {
    const v = variants?.[name];
    return v && ("false" in v || "true" in v);
  };

  return (props: VariantOptions<C>) => {
    const res = [base];

    const getSelected = (name: keyof V) =>
      (props as any)[name] ??
      defaultVariants?.[name] ??
      (isBooleanVariant(name) ? false : undefined);

    for (let name in variants) {
      const selected = getSelected(name);
      if (selected !== undefined) res.push(variants[name]?.[selected]);
    }

    for (let { variants, className } of compoundVariants ?? []) {
      const isSelected = (name: string) => getSelected(name) === variants[name];
      if (Object.keys(variants).every(isSelected)) {
        res.push(className);
      }
    }
    return res.filter(Boolean).join(" ");
  };
}

/**
 * No-op function to mark template literals as tailwind strings.
 */
export const tw = String.raw;
