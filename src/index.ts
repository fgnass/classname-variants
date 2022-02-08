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
  compoundVariants,
  defaultVariants,
}: VariantsConfig<V>) {
  return (props: VariantSelection<V>) => {
    const res = [base];

    const getSelected = (name: string) =>
      props[name] ?? defaultVariants?.[name];

    for (let name in variants) {
      const selected = getSelected(name);
      const options: any = variants[name];
      if (selected) res.push(options[selected]);
    }
    for (let { variants, className } of compoundVariants ?? []) {
      const isSelected = (name: string) => getSelected(name) == variants[name];
      const allSelected = Object.keys(variants).every(isSelected);
      if (allSelected) res.push(className);
    }
    return res.filter(Boolean).join(" ");
  };
}
