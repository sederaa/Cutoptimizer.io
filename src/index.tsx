import React from "react";
import ReactDOM from "react-dom";
import App from "main/components/App";
import * as serviceWorker from "./serviceWorker";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { init, trackPages } from "insights-js";

Sentry.init({
    dsn: "https://5a5c41d59dc745c1a6e18c4fcd58b939@o1140389.ingest.sentry.io/6197530",
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

if (process.env.NODE_ENV === "production") {
    init("USOiy_1fg8ToJIjy");
    trackPages();
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
