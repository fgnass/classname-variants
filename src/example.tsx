import React from "react";
import ReactDOM from "react-dom";
import { styled } from "./react";

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

const TitleCard = styled(CustomComponent, "bg-white p-4 border-2 rounded-lg");

const Button = styled("button", {
  base: "px-5 py-2 text-white disabled:bg-gray-400 disabled:text-gray-300",
  variants: {
    color: {
      neutral: "bg-slate-500 hover:bg-slate-400",
      accent: "bg-teal-500 hover:bg-teal-400",
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
      <Button foo>unknown property</Button>

      {/* @ts-expect-error */}
      <Card foo>Unknown property</Card>

      {/* @ts-expect-error */}
      <Button color="foo">Invalid variant</Button>

      {/* @ts-expect-error */}
      <Card as="b" href="https://example.com">
        B tags don't have a href attribute
      </Card>
    </div>
  );
}

function App() {
  return (
    <div className="flex justify-center items-center pt-8 gap-4 flex-wrap">
      <Button onClick={console.log}>Accent</Button>
      <Button rounded>Neutral + Rounded</Button>
      <Button color="accent" outlined>
        Accent + Outlined
      </Button>
      <Button color="accent" disabled>
        Disabled
      </Button>
      <TitleCard title="Hello" />
      <Card>
        <h1>Hello</h1>
        <p>world</p>
      </Card>
      <Card as="a" href="https://example.com">
        Link
      </Card>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
