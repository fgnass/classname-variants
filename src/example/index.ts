import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { render, h } from "preact";

import { ReactApp } from "./react";
import { PreactApp } from "./preact";

const root = createRoot(document.getElementById("react-root")!);
root.render(createElement(ReactApp));

render(h(PreactApp, {}), document.getElementById("preact-root")!);
