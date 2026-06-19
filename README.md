# Custom Theme Maker (CTM)

Custom Theme Maker (CTM) is a simple, real-time interactive VS Code extension designed to let you choose your own custom UI workbench and save into easily accessible presets.

If you have ever installed a theme that is a full-blown **rainbow** in the syntax and wish to edit it -  CTM can take care of that.       
If you want to have your own custom themes and switch between them ,whenever you feel like - CTM can take of that. 


## ✨ Features
The extension works fairly simple. It has an interactable UI that is easy to understand. Everything is written about *which* color changes *what*. You click the rctangle to open a color picker dropdown, where you can change between RGB, HEX or HSL types

<p align="center">
  <img width="316" height="285" alt="CTMColorDrop" src="https://github.com/user-attachments/assets/670e80d5-fd06-4fd8-a75a-702f6158f112" />
</p>

or you can type in the  HEX color of your choice in the input field right next to the color picker and can confirm or cancel your choice by the little buttons that appear to the right. 

<p align="center">
  <img width="316" height="83" alt="CTMColorChange" src="https://github.com/user-attachments/assets/f99fa661-2603-4998-9bb3-3c42822f728c" />
</p>

Managment is esential. Save the themes you just created....or delete them...

<p align="center">
  <img width="316" height="83" alt="CTMSaving" src="https://github.com/user-attachments/assets/6fdeacb8-09d7-45ed-8f76-f8ea913fc4b3" />
</p>

<br>
<p align="center">
  <img width="70%" alt="CTM" src="https://github.com/user-attachments/assets/3395867e-bb68-4098-b29d-be2cc19087ff" />
</p>  
<!-- width="1093" height="940" -->
<br>

* **Real-Time Workspace Syncing:** Modify colors via the native system color pickers and immediately view the changes live in your workspace without reloading windows.
* **Intelligent Accent Cascading:** Smart mapping infrastructure that automatically propagates UI colors down to specific child dependencies (e.g., dynamically adjusting scrollbar active/hover transparency parameters, terminal output pipes, and sidebar states).
* **Robust Syntax Tracking:** Deep integrations with TextMate rules and semantic token definitions to customize editor syntax code blocks directly.
* **Local Theme Storage Library:** Capture your live configurations into distinct named slots (stored safely using `globalState`). Swap presets seamlessly, reset targets cleanly, or drop configurations you no longer require.
* **Seamless Layout Integration:** Crafted to perfectly inherit VS Code native CSS theme variables (`--vscode-sideBar-background`, `--vscode-focusBorder`, etc.) ensuring a design that feels entirely natural to the editor.


## 🛠 Recent Core Improvements & Closed Issues

### 📐 Architecture & Performance
* **Decoupled Render Logic:** Isolated main UI markup completely by splitting complex raw HTML blocks out of the core script down into a dedicated `webviewHTML.ts` pipeline (#43).
* **Optimized Dependencies:** Deprecated legacy external utilities in favor of native API handling (#19).
* **Environment Integrity:** Stabilized workspace target tracking configurations across local environments, Copilot utilities, and WSL instances (#18).

### 🎨 Color Engine & Theme Propagation
* **Syntax Pipe Alignment:** Enabled color piping arrays mapping directly to syntax indicators and output logs (#32, #35).
* **Bracket & Indent Matching:** Tied punctuation and scope configurations directly into native bracket pairs (`editorBracketHighlight`) and vertical indentation guide frameworks (#25, #26).
* **Dynamic Component Adjustments:** Fully resolved inheritance mappings for Debug widgets, tooltips, run utilities, status indicators, and SVG icons (#16, #17, #20, #31, #33).

### 💄 UI & Animation Refinement
* **List-Based Preset Layout:** Swapped old layout modules for a robust, scroll-safe list layout container supporting scale and glide animations (#38).
* **Contrast & Visibility Audits:** Eliminated overlapping configurations where text or labels was inadvertently obscured behind dark backgrounds or muted gray hues (#23, #24, #28, #29).
* **Pixel-Perfect Alignment:** Fine-tuned spacing buffers around the scrollbar elements, search borders, and color inputs to completely prevent scale transitions from clipping parent boxes (#21, #22, #30, #34).
* **State Controls:** Introduced dedicated contrast color values for disabled controls and drop menus (#27, #37).


## 🚀 Installation

1. Open **VS Code**.
2. Launch the Extensions marketplace view using `Ctrl+Shift+X` (or `Cmd+Shift+X` on macOS).
3. Search for **Custom Theme Maker(CTM)** (by **Levoxyl**).
4. Click **Install**.

*Alternatively, if you are initializing via a local project development build, run `npx vsce package` and manually install the resulting `.vsix` file via the extensions panel options dropdown.*


## 📖 How to Use

1. Open the CTM Panel in your primary Activity Bar Sidebar (`theme-maker-view`).
2. Use the color rows to dynamically select backgrounds, syntax highlighting rules, or frame details.
3. To backup your progress, head down to the **Library Slots** section, click **Add Slot**, name your creation, and save it.
4. Click on any slot name to reload that profile layout instantly.
5. Hit **Reset Live Colors** to flush the live workspace variations back to your core system defaults.


## 📄 License

This project is licensed under the MIT License - see the local project `LICENSE` file for details.
