# classname-variants 🌈

Library to create type-safe components that render their class name based on a set of variants.

## Features

- ⚛️ Supports React, Preact and vanilla DOM
- 🛡️ Fully type-safe and excellent auto completion support
- ✅ Supports both optional and required variants
- 🔗 Supports custom strategies like [tailwind-merge](https://www.npmjs.com/package/tailwind-merge)
- 🪶 [Light-weight](https://bundlephobia.com/package/classname-variants) without any dependencies

![npm bundle size](https://img.shields.io/bundlephobia/minzip/classname-variants)

# Examples

Here is an example that uses React and Tailwind CSS:

```tsx
import { styled } from "classname-variants/react";

const Button = styled("button", {
  variants: {
    size: {
      small: "text-xs",
      large: "text-lg",
    },
    primary: {
      true: "bg-teal-500 text-white",
    },
  },
});

function UsageExample() {
  return <Button primary size="large" />;
}
```

[![Edit classname-variants/react](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/classname-variants-react-3bzjl?fontsize=14&hidenavigation=1&theme=dark)

While the library has been designed with tools like Tailwind in mind, it can be also used with custom classes or CSS modules:

## Preact + CSS modules

```tsx
import { styled } from "classname-variants/preact";
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

## Vanilla DOM

The core of the library is completely framework-agnostic:

```ts
import { variants } from "classname-variants";

const button = variants({
  base: "rounded text-white",
  variants: {
    color: {
      brand: "bg-sky-500",
      accent: "bg-teal-500",
    },
  },
});

document.write(`
  <button class="${button({ color: "accent" })}">
    Click Me!
  </button>
`);
```

# API

### Defining variants

You can add any number of variants by using the `variants` key.

```ts
{
  variants: {
    color: {
      primary: "bg-teal",
      secondary: "bg-indigo",
      danger: "bg-red"
    },
    size: {
      small: "text-sm",
      medium: "text-md",
      large: "text-lg",
    }
  }
}
```

### Boolean variants

Variants can be typed as `boolean` by using `true` / `false` as key:

```ts
{
  variants: {
    primary: {
      true: "bg-teal-500",
    },
  },
}
```

```ts
<Button primary>Click Me!</Button>
```

The `compoundVariants` option can be used to apply class names based on a combination of other variants:

```ts
{
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
}
```

### Default variants

If you define a variant it becomes a required prop unless you specify a default (or the variant is boolean). You can use the `defaultVariants` property to specify defaults:

```ts
{
  variants: {
    color: {
      primary: "bg-teal-300",
      secondary: "bg-teal-100"
    },
  },
  defaultVariants: {
    color: "secondary",
  }
}
```

### Base class

Use the `base` property to specify class names that should always be applied:

```ts
{
  base: "text-black rounded-full px-2",
  variants: {
    // ...
  }
}
```

### Components without variants

Sometimes it can be useful to define styled components that
don't have any variants, which can be done like this:

```tsx
import { styled } from "classname-variants/react";

const Button = styled("button", "bg-transparent border p-2");
```

### Styling custom components

You can style any custom React/Preact component as long as they accept a `className` prop (or `class` in case of Preact).

```tsx
function MyComponent(props) {
  return <div {...props}>I'm a stylable custom component.</div>;
}

const MyStyledComponent = styled(MyComponent, {
  base: "some-class",
  variants: {
    // ...
  },
});
```

### Polymorphic components with "as"

If you want to keep all the variants you have defined for a component but want to render a different HTML tag or a different custom component, you can use the `as` prop to do so:

```tsx
import { styled } from "classname-variants/react";

const Button = styled("button", {
  variants: {
    //...
  },
});
```

The component can then be rendered as button or as anchor or even as custom component exposed by some router:

```tsx
<>
  <Button>I'm a button</Button>
  <Button as="a" href="/">
    I'm a link!
  </Button>
  <Button as={Link} to="/">
    I'm a styled Link component
  </Button>
</>
```

### Using a custom strategy to combine class names

The built-in strategy for combining multiple class names into one string is simple and straightforward:

```ts
(classes) => classes.filter(Boolean).join(" ");
```

If you [want](https://github.com/dcastil/tailwind-merge/blob/main/docs/when-and-how-to-use-it.md), you can use a custom strategy like tailwind-merge instead:

```ts
import { classNames } from "classname-variants";
import { twMerge } from "tailwind-merge";

classNames.combine = twMerge;
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

# For AI Assistants

For comprehensive technical documentation optimized for LLMs, see [`llms.txt`](./llms.txt).

# License

MIT
