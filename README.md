# classname-variants

Stitches-like [variant API](https://stitches.dev/docs/variants) for plain class names.

The library is framework-agnostic and can be used with any kind of CSS flavor.

It is especially useful though if used with [Tailwind](https://tailwindcss.com/) or [CSS Modules](https://github.com/css-modules/css-modules) in combination with React, as it provides some [dedicated helpers](#React) and even allows for a _styled-components_ like API, but with [class names instead of styles](#bonus-styled-components-but-with-class-names-)!

[![Edit classname-variants/react](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/classname-variants-react-3bzjl?fontsize=14&hidenavigation=1&theme=dark)

# Basics

Let's assume we want to build a button component with Tailwind CSS that comes in different sizes and colors.

It consists of some _base classes_ that are always present as well as some optional classes that need to be added depending on the desired _variants_.

```tsx
const button = variants({
  base: "rounded text-white",
  variants: {
    color: {
      brand: "bg-sky-500",
      accent: "bg-teal-500",
    },
    size: {
      small: "px-5 py-3 text-xs",
      large: "px-6 py-4 text-base",
    },
  },
});
```

The result is a function that expects an object which specifies what variants should be selected. When called, it returns a string containing the respective class names:

```ts
document.write(`
  <button class="${button({
    color: "accent",
    size: "large",
  })}">
    Click Me!
  </button>
`);
```

# Advanced Usage

## Boolean variants

Variants can be of type `boolean` by using `"true"` as the key:

```tsx
const button = variants({
  base: "text-white",
  variants: {
    rounded: {
      true: "rounded-full",
    },
  },
});
```

## Compound variants

The `compoundVariants` option can be used to apply class names based on a combination of other variants.

```tsx
const button = variants({
  variants: {
    color: {
      neutral: "bg-gray-200",
      accent: "bg-teal-400",
    },
    outlined: {
      true: "border-2",
    },
  },
  compoundVariants: [
    {
      variants: {
        color: "accent",
        outlined: true,
      },
      className: "border-teal-500",
    },
  ],
});
```

## Default variants

The `defaultVariants` option can be used to select a variant by default:

```ts
const button = variants({
  variants: {
    color: {
      neutral: "bg-gray-200",
      accent: "bg-teal-400",
    },
  },
  defaultVariants: {
    color: "neutral",
  },
});
```

# React

The library contains utility functions that are useful for writing React components.

It works much like `variants()` but instead of a class name string, the resulting function returns an object with props.

```ts
import { variantProps } from "classname-variants/react";

const buttonProps = variantProps({
  base: "rounded-md text-white",
  variants: {
    color: {
      brand: "bg-sky-500",
      accent: "bg-teal-500",
    },
    size: {
      small: "px-5 py-3 text-xs",
      large: "px-6 py-4 text-base",
    },
    rounded: {
      true: "rounded-full",
    },
  },
  defaultVariants: {
    color: "brand",
  },
});
```

This way a component's props (or part of them) can be directly spread into the target element. All variant-related props are used to construct the `className` property while all other props are passed through verbatim:

```tsx
type Props = JSX.IntrinsicElements["button"] &
  VariantPropsOf<typeof buttonProps>;

function Button(props: Props) {
  return <button {...buttonProps(props)} />;
}

function App() {
  return (
    <Button size="small" color="accent" onClick={console.log}>
      Click Me!
    </Button>
  );
}
```

# Bonus: styled-components, but for static CSS 💅

Things can be taken even a step further, resulting in a _styled-components_ like way of defining reusable components. Under the hood, this does basically the same as the example above, but also handles _refs_ correctly:

```ts
import { styled, tw } from "classname-variants/react";

const Button = styled("button", {
  variants: {
    size: {
      small: tw`text-xs`,
      large: tw`text-base`,
    },
  },
});
```

Again, this is not limited to tailwind, so you could do the same with CSS modules:

```ts
import { styled } from "classname-variants/react";
import styles from "./styles.module.css";

const Button = styled("button", {
  variants: {
    size: {
      small: styles.small,
      large: styles.large,
    },
  },
});
```

> [!TIP]
> You can also style other custom React components as long as they accept a `className` prop.

## Styled components without variants

You can also use the `styled` function to create styled components without any variants at all:

```ts
import { styled } from "classname-variants/react";

const Button = styled(
  "button",
  "border-none rounded px-3 font-sans bg-green-600 text-white hover:bg-green-500"
);
```

## Polymorphic components with "as"

If you want to keep all the variants you have defined for a component but want to render a different HTML tag or a different custom component, you can use the "as" prop to do so:

```tsx
import { styled } from "classname-variants/react";

const Button = styled("button", {
  variants: {
    //...
  },
});

function App() {
  return (
    <div>
      <Button>I'm a button</Button>
      <Button as="a" href="/">
        I'm a link!
      </Button>
    </div>
  );
}
```

# Tailwind IntelliSense

In order to get auto-completion for the CSS classes themselves, you can use the [Tailwind CSS IntelliSense](https://github.com/tailwindlabs/tailwindcss-intellisense) plugin for VS Code. In order to make it recognize the strings inside your variants-config, you have to somehow mark them and configure the plugin accordingly.

One way of doing so is by using tagged template literals:

```ts
import { variants, tw } from "classname-variants";

const button = variants({
  base: tw`px-5 py-2 text-white`,
  variants: {
    color: {
      neutral: tw`bg-slate-500 hover:bg-slate-400`,
      accent: tw`bg-teal-500 hover:bg-teal-400`,
    },
  },
});
```

You can then add the following line to your `settings.json`:

```
"tailwindCSS.experimental.classRegex": ["tw`(.+?)`"]
```

> [!NOTE]
> The `tw` helper function is just an alias for [`String.raw()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw) which has the nice side effect backslashes are not treated as [escape character in JSX](https://tailwindcss.com/docs/adding-custom-styles#handling-whitespace).

In order to get type coverage even for your Tailwind classes, you can use a tool like [tailwind-ts](https://github.com/mathieutu/tailwind-ts).

# License

MIT
