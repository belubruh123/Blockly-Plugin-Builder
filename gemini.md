# Project Context for Gemini

## Project Overview
**Blockly Plugin Builder** is a web-based, no-code visual development tool for creating Minecraft server plugins (specifically for Paper/Spigot 1.21+). It uses [Google Blockly](https://developers.google.com/blockly) to allow users to design logic visually, which is then compiled into Java source code, `plugin.yml`, and `pom.xml` for download.

## Core Objective
To enable users (especially beginners/kids) to create functional Minecraft plugins without writing code. The tool focuses on "Smart Blocks" that auto-detect context (like "Me" vs "Target") to simplify logic.

## Architecture

### Frontend
- **Entry Point:** `index.html` (Main UI, Tailwind CSS).
- **Styling:** `css/style.css` + Tailwind CDN.

### Logic & Generation (The Brains)
- **`js/main.js`**: 
    - Initializes Blockly workspace.
    - Handles the "Generate Code" logic (`generateCode()`).
    - Orchestrates file generation (`Main.java`, `pom.xml`, `plugin.yml`).
    - Manages the UI toolbox and tabs.
- **`js/blocks_def.js`**: 
    - Defines the custom Blockly blocks (appearance, inputs, tooltips).
    - Contains "Smart Blocks" like `ez_action_teleport`, `ez_action_replace_block`.
- **`js/generator_java.js`**: 
    - Translates the visual blocks into Java source code.
    - Implements the "Smart" logic (e.g., casting `sender` to `Player`, handling `Location` vs `Entity` inputs).
- **`js/api_data.js`**: 
    - Contains metadata for Paper API methods and events (used to dynamically generate some blocks).
- **`js/block_loader.js`**: 
    - Dynamically loads blocks based on `api_data.js`.

## Key Concepts

### "Smart Blocks" (Easy Mode)
These blocks are designed to be "Type-Agnostic" where possible.
- **Example:** `ez_action_teleport` accepts a Target and a Destination.
    - If Target is empty -> Defaults to `event.getPlayer()` or `sender`.
    - If Destination is an Entity -> Generates code to get that entity's location.
    - This logic is handled in `js/generator_java.js` via helpers like `getSmartMe` and `generateSmartLoc`.

### Code Generation Strategy
- The generator creates a single `Main.java` (extending `JavaPlugin`).
- Commands are generated as separate classes (e.g., `MycommandCommand.java`) implementing `CommandExecutor`.
- `pom.xml` is generated to handle Maven dependencies (Paper API).

## recent Updates
- Added "For Loops" and "List" (Array) support.
- Added "World" actions (Explosion, Lightning, Replace Block).
- Added "Player" abilities (Flight, Health).
- Fixed `ReferenceError` in `pom.xml` generation.

## Future Goals
- Add more event support.
- Improve "Smart" detection for complex logic.
- Add "Inventory" management blocks.
