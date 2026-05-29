import { defineConfig, presetUno } from "npm:unocss";

export default defineConfig({
  presets: [presetUno()],
  shortcuts: {
    "brutal-border": "border-2 border-black",
    "mono": "font-mono tracking-tight",
  },
  theme: {
    fontFamily: {
      notch: ["'Stack Sans Notch'", "sans-serif"],
      headline: ["'Stack Sans Headline'", "sans-serif"],
      text: ["'Stack Sans Text'", "sans-serif"],
      mono: ["'Roboto Mono'", "monospace"],
    },
    colors: {
      ink: "#0a0a0a",
      chalk: "#f5f5f0",
    },
  },
});
