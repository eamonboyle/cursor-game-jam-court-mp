import "./style.css";
import { createApp } from "./app/bootstrap";
import { mountWelcomeGate, shouldSkipWelcomeScreen } from "./ui/welcomeGate";

const app = createApp();
const root = document.getElementById("app-root");
if (!root) throw new Error("Missing #app-root");

if (shouldSkipWelcomeScreen()) {
  void app.start();
} else {
  mountWelcomeGate(root, () => {
    void app.start();
  });
}
