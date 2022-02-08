import React from "react";
import ReactDOM from "react-dom";
import { styled } from "./src/react";

const Button = styled("button", {
  base: "rounded-md px-5 py-2 text-white",
  variants: {
    color: {
      neutral: "bg-gray-500",
      accent: "bg-teal-500",
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
      className: "border-teal-800",
    },
  ],
});

function App() {
  return (
    <>
      <Button color="neutral" onClick={console.log}>
        Neutral
      </Button>
      <Button color="accent" outlined onClick={console.log}>
        Accent + Outlined
      </Button>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
