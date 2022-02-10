import React from "react";
import ReactDOM from "react-dom";
import { styled } from "./src/react";

function CustomComponent({
  title,
  ...props
}: {
  className?: string;
  title: string;
}) {
  return <div {...props}>{title}</div>;
}

const Card = styled(CustomComponent, {
  base: "bg-white p-4 border-2 rounded-lg",
  variants: {},
});

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
      <Card title="Hello" />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
