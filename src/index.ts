export type VariantDefinitions = Record<string, string>;

export type Variants = Record<string, VariantDefinitions>;

export type VariantsConfig<V extends Variants> = {
  base?: string;
  variants?: V;
  compoundVariants?: CompoundVariant<V>[];
  defaultVariants?: VariantSelection<V>;
};

export type CompoundVariant<V extends Variants> = {
  variants: VariantSelection<V>;
  className: string;
};

export type VariantSelection<V extends Variants> = {
  [VariantName in keyof V]?: StringToBool<keyof V[VariantName]>;
};

type StringToBool<T> = T extends "true" | "false" ? boolean : T;

export function variants<V extends Variants>({
  base,
  variants,
  compoundVariants = [],
  defaultVariants = {},
}: VariantsConfig<V>) {
  const isBooleanVariant = (name: string) => {
    const v = variants?.[name];
    return v && ("false" in v || "true" in v);
  };

  return (props: VariantSelection<V>) => {
    const res = [base];

    const getSelected = (name: string) =>
      props[name] ??
      defaultVariants[name] ??
      (isBooleanVariant(name) ? false : undefined);

    for (let name in variants) {
      const selected = getSelected(name);
      if (selected !== undefined) res.push(variants[name][selected.toString()]);
    }

    for (let { variants, className } of compoundVariants) {
      const isSelected = (name: string) => getSelected(name) === variants[name];
      if (Object.keys(variants).every(isSelected)) {
        res.push(className);
      }
    }
    return res.filter(Boolean).join(" ");
  };
}
