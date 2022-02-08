import {
  ComponentProps,
  createElement,
  ElementType,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
} from "react";

import {
  Variants,
  variants,
  VariantsConfig,
  VariantOptions,
  Simplify,
} from ".";

export type VariantProps<T> = T extends (props: infer VariantSelection) => any
  ? VariantSelection
  : never;

export function variantProps<
  C extends VariantsConfig<V>,
  V extends Variants = C["variants"]
>(config: Simplify<C>) {
  const mkClass = variants<C>(config);
  return <T extends VariantOptions<C>>(props: T) => {
    const className = mkClass(props);
    const result: any = { className };
    for (let prop in props) {
      if (config.variants && !(prop in config.variants)) {
        result[prop] = props[prop];
      }
    }
    return result as { className: string } & Omit<T, keyof C["variants"]>;
  };
}

type StyledComponent<
  P extends ElementType,
  C extends VariantsConfig<V>,
  V extends Variants = C["variants"]
> = ForwardRefExoticComponent<
  PropsWithoutRef<ComponentProps<P> & VariantOptions<C>> &
    React.RefAttributes<P>
>;

export function styled<
  P extends ElementType,
  C extends VariantsConfig<V>,
  V extends Variants = C["variants"]
>(type: P, config: Simplify<C>): StyledComponent<P, C> {
  const styledProps = variantProps(config);
  return forwardRef<P, ComponentProps<P> & VariantOptions<C>>((props, ref) =>
    createElement(type, { ...styledProps(props), ref })
  );
}
