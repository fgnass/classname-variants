/** @jsx h */

// biome-ignore lint/correctness/noUnusedImports: Preact JSX pragma requires importing h
import { h } from "preact";
import { styled } from "../preact";

function CustomComponent({
  title,
  ...props
}: {
  className?: string;
  title: string;
}) {
  return <div {...props}>{title}</div>;
}

const Card = styled("div", "bg-white p-4 border-2 rounded-lg");

const TitleCard = styled(CustomComponent, {
  base: "bg-white p-4 border-2 rounded-lg",
  defaultProps: {
    title: "Default Title",
  },
});

const Button = styled("button", {
  base: "px-5 py-2 text-white disabled:bg-gray-400 disabled:text-gray-300",
  variants: {
    color: {
      neutral: "bg-slate-500 hover:bg-slate-400",
      accent: "bg-teal-500 hover:bg-teal-400",
    },
    size: {
      small: "text-sm",
      medium: "text-md",
    },
    outlined: {
      true: "border-2",
    },
    rounded: {
      true: "rounded-full",
      false: "rounded-sm",
    },
  },
  compoundVariants: [
    {
      variants: { color: "accent", outlined: true },
      className: "border-teal-600",
    },
  ],
  defaultVariants: {
    color: "neutral",
  },
  defaultProps: {
    type: "button",
  },
});

export const ExpectErrors = styled("div", {
  variants: {
    color: {
      neutral: "grey",
      accent: "hotpink",
    },
  },
  compoundVariants: [
    {
      //@ts-expect-error
      variants: { outlined: true },
      className: "",
    },
  ],
  defaultVariants: {
    //@ts-expect-error
    outlined: true,
  },
});

export function WithErrors() {
  return (
    <div>
      {/* @ts-expect-error */}
      <Button foo size="medium">
        unknown property
      </Button>

      {/* @ts-expect-error */}
      <Card foo>Unknown property</Card>

      {/* @ts-expect-error */}
      <Button color="foo" size="medium">
        Invalid variant
      </Button>

      {/* @ts-expect-error */}
      <Button>Missing size</Button>
    </div>
  );
}

export function PreactApp() {
  return (
    <div className="flex justify-center items-center pt-8 gap-4 flex-wrap">
      <Button onClick={console.log} size="medium">
        Neutral
      </Button>
      <Button rounded size="medium">
        Neutral + Rounded
      </Button>
      <Button color="accent" outlined size="medium">
        Accent + Outlined
      </Button>
      <Button color="accent" disabled size="medium">
        Disabled
      </Button>
      <TitleCard />
      <TitleCard title="Hello" />
      <Card>
        <h1>Hello</h1>
        <p>world</p>
      </Card>
      <Card as="a" href="https://example.com">
        Link
      </Card>
      <Card as={CustomComponent} title="Test" />
    </div>
  );
}
