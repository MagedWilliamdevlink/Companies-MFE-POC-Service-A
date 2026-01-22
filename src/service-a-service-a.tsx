import React from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";
import Root from "./root.component";

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: Root,
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    console.error("Error in service-a:", err, info);
    return React.createElement(
      "div",
      {
        style: {
          padding: "20px",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffc107",
          borderRadius: "4px",
          margin: "20px",
          color: "#856404",
        },
      },
      React.createElement("h3", null, "حدث خطأ في تحميل الخدمة"),
      React.createElement("p", null, err?.message || "خطأ غير معروف"),
      React.createElement("details", { style: { marginTop: "10px" } },
        React.createElement("summary", null, "تفاصيل الخطأ"),
        React.createElement("pre", { style: { fontSize: "12px", overflow: "auto" } },
          err?.stack || JSON.stringify(info, null, 2)
        )
      )
    );
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
