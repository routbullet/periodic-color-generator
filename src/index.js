import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA: prod-only registration. onUpdate notifies Home via window event,
// which shows the "new version — reload" bar.
serviceWorkerRegistration.register({
  onUpdate: () => {
    window.dispatchEvent(new CustomEvent("pwa-update"));
  },
});
