# Blockly Plugin Builder for Minecraft (Paper/Spigot)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Platform](https://img.shields.io/badge/platform-Web-orange.svg)

**Blockly Plugin Builder** is a powerful, web-based visual development environment designed to democratize Minecraft server plugin creation. By leveraging [Google Blockly](https://developers.google.com/blockly), it allows users—from beginners to experienced administrators—to construct complex server logic, commands, and event handlers without writing a single line of Java code.

This tool automatically generates production-ready Java source code, Maven configuration (`pom.xml`), and plugin metadata (`plugin.yml`), allowing for immediate compilation and deployment to Paper, Spigot, or Bukkit servers.

---

## 🚀 Key Features

### 🧩 Visual Logic Editor
- **Drag-and-Drop Interface:** Intuitive block-based coding eliminates syntax errors.
- **Event-Driven Architecture:** Easily handle server events like `PlayerJoinEvent`, `BlockBreakEvent`, and more.
- **Command Creator:** Define custom server commands with arguments and permissions visually.

### ⚡ "Smart Blocks" (Easy Mode)
- **Context-Aware Actions:** Blocks like "Teleport" or "Give Item" automatically detect the context (e.g., the player who ran the command) to reduce boilerplate.
- **Auto-Type Detection:** Intelligent inputs handle `Location` vs. `Entity` differences automatically.
- **Fun Features:** Built-in blocks for Lightning, Explosions, Titles, and specialized Player Abilities (Flight, Health).

### 🛠️ Professional Code Generation
- **Real-Time Java Preview:** Watch the Java code compile in real-time as you build your logic.
- **Maven Support:** Automatically generates a valid `pom.xml` with dependencies for the Paper API.
- **Project Export:** One-click download of the entire project structure as a `.zip` file, ready for your IDE or build server.

---

## 📂 Project Structure

```text
/
├── index.html          # Main application entry point
├── css/
│   └── style.css       # Custom styling (Tailwind CSS overrides)
├── js/
│   ├── main.js         # Core application logic & UI handling
│   ├── blocks_def.js   # Custom Blockly definitions
│   ├── generator_java.js # Logic for translating blocks to Java
│   ├── api_data.js     # Paper API mappings (Events, Methods)
│   └── block_loader.js # Dynamic block loader
└── docs/               # Documentation & Help files
```

## 🛠️ Tech Stack

- **Frontend:** HTML5, Tailwind CSS (via CDN)
- **Logic Engine:** Google Blockly
- **Export Engine:** JSZip
- **Target Platform:** Minecraft (Paper API 1.21+)

## 📦 Getting Started

### Prerequisites
- A modern web browser.
- (Optional) JDK 21+ and Maven to compile the downloaded source code.

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/belubruh123/Blockly-Plugin-Builder.git
   ```
2. Open `index.html` in your browser.

### Usage
1. **Design:** Use the sidebar to drag blocks onto the workspace.
2. **Configure:** Set project metadata (Name, Author, Version) in the header.
3. **Preview:** Check the "Main.java" tab to see the generated code.
4. **Download:** Click "Download Plugin" to get a ready-to-compile ZIP file.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

**Maintainer:** [belubruh123]
**Email:** tallplaylin@gmail.com

---
*Built with ❤️ for the Minecraft Community.*
