// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import { store } from "./store";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#1f2937",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow:
              "0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)",
            padding: "12px 16px",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#16a34a", secondary: "#ffffff" },
          },
          error: {
            iconTheme: { primary: "#dc2626", secondary: "#ffffff" },
          },
        }}
      />
    </Provider>
  </React.StrictMode>,
);
