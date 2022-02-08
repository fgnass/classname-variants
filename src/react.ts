import {
  ComponentProps,
  createElement,
  ElementType,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
} from "react";

import { Variants, variants, VariantsConfig, VariantSelection } from ".";

export type VariantProps<T> = T extends (props: infer VariantSelection) => any
  ? VariantSelection
  : never;

export function variantProps<V extends Variants>(config: VariantsConfig<V>) {
  const mkClass = variants(config);
  return <T extends VariantSelection<V>>(props: T) => {
    const className = mkClass(props);
    const result: any = { className };
    for (let prop in props) {
      if (config.variants && !(prop in config.variants)) {
        result[prop] = props[prop];
      }
    }
    return result as { className: string } & Omit<T, keyof V>;
  };
}

type StyledComponent<
  P extends ElementType,
  V extends Variants
> = ForwardRefExoticComponent<
  PropsWithoutRef<ComponentProps<P> & VariantSelection<V>> &
    React.RefAttributes<P>
>;

export function styled<P extends ElementType, V extends Variants>(
  type: P,
  config: VariantsConfig<V>
): StyledComponent<P, V> {
  const styledProps = variantProps(config);
  return forwardRef<P, ComponentProps<P> & VariantSelection<V>>((props, ref) =>
    createElement(type, { ...styledProps(props), ref })
  );
}
