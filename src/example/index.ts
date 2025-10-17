import { h, render } from "preact";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { PreactApp } from "./preact";
import { ReactApp } from "./react";

const root = createRoot(document.getElementById("react-root")!);
root.render(createElement(ReactApp));

render(h(PreactApp, {}), document.getElementById("preact-root")!);
