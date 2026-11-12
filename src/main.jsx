import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { exchangeCodeForToken } from "./api";

exchangeCodeForToken()
  .then((token) => {
    if (token) {
      console.log("Spotify подключён, токен сохранён");
    }
  })
  .catch((error) => {
    console.error("Ошибка подключения Spotify:", error.message);
  });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
