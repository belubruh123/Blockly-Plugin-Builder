import { defineBlocks } from './blocks_def.js';
import { initJavaGenerator } from './generator_java.js';
import { generatePluginYml } from './generator_yml.js';
import { loadDynamicBlocks } from './block_loader.js';
import { API_DATA } from './api_data.js';

// Initialize Blocks (Legacy + Dynamic)
defineBlocks();
const javaGenerator = initJavaGenerator();
loadDynamicBlocks(Blockly, javaGenerator);

// --- UTILS ---
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// --- DYNAMIC TOOLBOX GENERATION ---
const generateToolbox = () => {
    // Safety check
    if (!API_DATA) return { "kind": "categoryToolbox", "contents": [] };
    const { enums, events, methods, context_getters } = API_DATA;

    const contents = [];

    // 1. Events
    const eventBlocks = events.map(evt => ({
        "kind": "block",
        "type": `paper_event_${evt.id.toLowerCase()}`
    }));
    contents.push({
        "kind": "category",
        "name": "Events",
        "colour": "230",
        "contents": eventBlocks
    });

    // 2. Commands
    contents.push({
        "kind": "category",
        "name": "Commands",
        "colour": "120",
        "contents": [
            { "kind": "block", "type": "paper_command" },
            { "kind": "block", "type": "paper_command_arg_get" },
            { "kind": "block", "type": "paper_command_args_length" }
        ]
    });

    // 3. Actions (Chat & UI)
    contents.push({
        "kind": "category",
        "name": "Actions",
        "colour": "160",
        "contents": [
            { "kind": "block", "type": "ez_action_message" },
            { "kind": "block", "type": "ez_action_title" },
            { "kind": "block", "type": "ez_action_give" }
        ]
    });

    // 3.5 Player
    contents.push({
        "kind": "category",
        "name": "Player",
        "colour": "260", 
        "contents": [
             { "kind": "block", "type": "ez_action_set_health" },
             { "kind": "block", "type": "ez_action_toggle_flight" },
             { "kind": "block", "type": "paper_action_set_attribute" },
             { "kind": "block", "type": "ez_action_attribute_change" },
             { "kind": "block", "type": "ez_expr_attribute_get" }
        ]
    });

    // 3.6 World
    contents.push({
        "kind": "category",
        "name": "World",
        "colour": "30", 
        "contents": [
             { "kind": "block", "type": "ez_action_teleport" },
             { "kind": "block", "type": "ez_action_replace_block" },
             { "kind": "block", "type": "ez_action_spawn_lightning" },
             { "kind": "block", "type": "ez_action_explosion" }
        ]
    });

    // 3.7 Data / Config (For TPA/Home)
    contents.push({
        "kind": "category",
        "name": "Data / Config",
        "colour": "290",
        "contents": [
             { "kind": "block", "type": "ez_config_set" },
             { "kind": "block", "type": "ez_config_get" },
             { "kind": "block", "type": "ez_data_set_global" },
             { "kind": "block", "type": "ez_data_get_global" },
             { "kind": "block", "type": "ez_convert_to_string" },
             { "kind": "block", "type": "ez_convert_to_number" }
        ]
    });

    // 3.8 Fun / Troll / Admin
    contents.push({
        "kind": "category",
        "name": "Fun & Admin",
        "colour": "0",
        "contents": [
             { "kind": "block", "type": "paper_event_entity_death" },
             { "kind": "block", "type": "ez_val_victim" },
             { "kind": "block", "type": "ez_val_attacker" },
             { "kind": "block", "type": "ez_action_ban" },
             { "kind": "block", "type": "ez_action_kick" },
             { "kind": "block", "type": "ez_action_sound" },
             { "kind": "block", "type": "ez_action_particle" }
        ]
    });

    // 4. My Data
    contents.push({
        "kind": "category",
        "name": "My Data",
        "colour": "290",
        "contents": [
            { "kind": "block", "type": "ez_val_me" },
            { "kind": "block", "type": "var_declare_typed" },
            { "kind": "block", "type": "var_set_typed" },
            { "kind": "block", "type": "var_get_typed" }
        ]
    });

    // 5. Logic
    contents.push({
        "kind": "category",
        "name": "Logic",
        "colour": "210",
        "contents": [
            { "kind": "block", "type": "controls_if" },
            { "kind": "block", "type": "logic_compare" },
            { "kind": "block", "type": "logic_operation" },
            { "kind": "block", "type": "logic_negate" },
            { "kind": "block", "type": "logic_boolean" },
            { "kind": "block", "type": "logic_is_type" }
        ]
    });

    // 6. Loops
    contents.push({
        "kind": "category",
        "name": "Loops",
        "colour": "120",
        "contents": [
            { "kind": "block", "type": "controls_repeat_ext", "inputs": { "TIMES": { "shadow": { "type": "math_number", "fields": { "NUM": 10 } } } } },
            { "kind": "block", "type": "controls_whileUntil" },
            { "kind": "block", "type": "controls_for_simple", "inputs": { "FROM": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } }, "TO": { "shadow": { "type": "math_number", "fields": { "NUM": 10 } } } } }
        ]
    });

    // 6.5 Lists
    contents.push({
        "kind": "category",
        "name": "Lists",
        "colour": "260",
        "contents": [
            { "kind": "block", "type": "lists_create_new" },
            { "kind": "block", "type": "lists_add" },
            { "kind": "block", "type": "lists_get_index" },
            { "kind": "block", "type": "lists_size" }
        ]
    });

    // 7. Math
    contents.push({
        "kind": "category",
        "name": "Math",
        "colour": "230",
        "contents": [
            { "kind": "block", "type": "math_number" },
            { "kind": "block", "type": "math_arithmetic" },
            { "kind": "block", "type": "text_string" }
        ]
    });
    
    // 8. Locations
    contents.push({
        "kind": "category",
        "name": "Locations",
        "colour": "290",
        "contents": [
             { "kind": "block", "type": "ez_val_location_of" },
             { "kind": "block", "type": "ez_val_coords" },
             { "kind": "block", "type": "paper_method_get_spawn_location" } 
        ]
    });

    // --- SEPARATOR ---
    contents.push({ "kind": "sep" });

    // --- API CATEGORIES (Flattened for Safety) ---
    
    // Group methods
    const methodsByTarget = {};
    methods.forEach(m => {
        let target = m.target || "Utils";
        if (m.method.startsWith('event.')) target = "Event Control";
        if (!methodsByTarget[target]) methodsByTarget[target] = [];
        
        const cleanName = m.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        methodsByTarget[target].push({
            "kind": "block",
            "type": `paper_method_${cleanName}`
        });
    });

    Object.keys(methodsByTarget).forEach(target => {
        let color = "0";
        if (target === "Event Control") color = "230";
        else if (API_DATA.types[target]) color = API_DATA.types[target].color;
        
        contents.push({
            "kind": "category",
            "name": `API: ${target}`,
            "colour": color.toString(),
            "contents": methodsByTarget[target]
        });
    });

    return { "kind": "categoryToolbox", "contents": contents };
};
// --- SEARCH LOGIC ---
const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const fullToolbox = generateToolbox();
    
    if (!term) {
        workspace.updateToolbox(fullToolbox);
        return;
    }

    // Filter Logic
    const filteredContents = [];
    
    fullToolbox.contents.forEach(cat => {
        // If it's a category with contents
        if (cat.contents) {
            const matchingBlocks = cat.contents.filter(block => {
                // Check block type name (e.g. paper_action_teleport)
                // In a real app, we'd check the human readable text too, but that requires instantiating the block or a lookup map.
                // We'll match against the type key for now, and some mapped keywords.
                // Improvement: Check against API_DATA names if it matches 'paper_method_...'
                
                let textMatch = block.type.toLowerCase().includes(term);
                
                // Hacky readable name check for API methods
                if (!textMatch && block.type.startsWith('paper_method_')) {
                     const apiName = block.type.replace('paper_method_', '').replace(/_/g, ' ');
                     if (apiName.includes(term)) textMatch = true;
                }
                
                return textMatch;
            });

            if (matchingBlocks.length > 0) {
                // Clone category to avoid mutating original
                const newCat = { ...cat, contents: matchingBlocks, expanded: "true" };
                filteredContents.push(newCat);
            }
        }
    });

    // If nothing found but term exists, show empty
    if (filteredContents.length === 0) {
        // Optional: Show a "No results" category?
    }

    workspace.updateToolbox({ "kind": "categoryToolbox", "contents": filteredContents });
};

document.getElementById('block-search').addEventListener('input', debounce(handleSearch, 300));

const workspace = Blockly.inject('blocklyDiv', {
    toolbox: generateToolbox(),
    renderer: 'geras',
    theme: Blockly.Theme.defineTheme('dark', {
        'base': Blockly.Themes.Classic,
        'componentStyles': {
            'workspaceBackgroundColour': '#1f2937', // gray-850
            'toolboxBackgroundColour': '#111827', // gray-900
            'toolboxForegroundColour': '#fff',
            'flyoutBackgroundColour': '#1f2937',
            'flyoutOpacity': 0.8,
            'scrollbarColour': '#4b5563',
        }
    })
});

// Store generated files content
let generatedFiles = {};
let currentFile = 'Main.java';
let currentPackagePath = "com/example/plugin"; // Default

// --- GENERATION ORCHESTRATOR ---

const generateCode = () => {
    generatedFiles = {};
    
    // Get Project Settings
    const projectNameRaw = document.getElementById('project-name').value || "MyPlugin";
    const authorRaw = document.getElementById('project-author').value || "Author";
    const version = document.getElementById('project-version').value || "1.0";

    // Sanitize Package Name
    const cleanStr = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const packageName = `dev.${cleanStr(authorRaw)}.${cleanStr(projectNameRaw)}`;
    currentPackagePath = packageName.replace(/\./g, '/');

    const topBlocks = workspace.getTopBlocks(false);
    
    // Containers
    let eventsCode = "";
    let commands = []; // List of { name, code }

    // 1. Walk top blocks
    topBlocks.forEach(block => {
        if (block.type.startsWith('paper_event_')) { 
            eventsCode += javaGenerator.blockToCode(block);
        } else if (block.type === 'paper_command') {
            const cmdName = block.getFieldValue('CMD_NAME');
            const logic = javaGenerator.blockToCode(block);
            commands.push({ name: cmdName, code: logic });
        }
    });

    // 2. Build Main.java
    const mainJava = `package ${packageName};

import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.event.Listener;
import org.bukkit.event.EventHandler;
import org.bukkit.event.player.*;
import org.bukkit.event.block.*;
import org.bukkit.event.entity.*;
import org.bukkit.event.server.*;
import net.kyori.adventure.text.Component;
import org.bukkit.Material;
import org.bukkit.inventory.ItemStack;
import org.bukkit.*;
import org.bukkit.entity.*;
import org.bukkit.block.Block;
import org.bukkit.attribute.Attribute;
import java.util.HashMap;
import java.util.Map;

/**
 * ${projectNameRaw} v${version}
 * Created by ${authorRaw}
 */
public class Main extends JavaPlugin implements Listener {

    public static Map<String, Object> globalData = new HashMap<>();

    @Override
    public void onEnable() {
        // Config
        saveDefaultConfig();

        // Register Events
        getServer().getPluginManager().registerEvents(this, this);
        
        // Register Commands
${commands.map(c => `        if (getCommand("${c.name}") != null) getCommand("${c.name}").setExecutor(new ${capitalize(c.name)}Command());`).join('\n')}
        
        getLogger().info("${projectNameRaw} enabled!");
    }

    // Helper for "Number from Text" block
    public double tryParseDouble(String s) {
        try { return Double.parseDouble(s); } catch (Exception e) { return 0; }
    }

    ${eventsCode}
}
`;
    generatedFiles['Main.java'] = mainJava;

    // 3. Build Command Files
    commands.forEach(cmd => {
        const className = capitalize(cmd.name) + "Command";
        const fileContent = `package ${packageName};

import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import net.kyori.adventure.text.Component;
import org.bukkit.Material;
import org.bukkit.inventory.ItemStack;
import org.bukkit.*;
import org.bukkit.entity.*;
import org.bukkit.attribute.Attribute;
import org.jetbrains.annotations.NotNull;

public class ${className} implements CommandExecutor {

    @Override
    public boolean onCommand(@NotNull CommandSender sender, @NotNull Command command, @NotNull String label, @NotNull String[] args) {
        // Access Main helper if needed (but we are in another class).
        // For simplicity, we assume static access or duplicate helper if needed.
        // Actually, for "tryParseDouble" usage inside commands, we need it available.
        // Quick fix: We can rely on Main.getPlugin(Main.class).tryParseDouble() but that's messy.
        // Better: Make it static or just inline the try-catch in generator?
        // Generator used 'tryParseDouble', so we need it.
        // Let's make a local helper in every command class to be safe/easy.
${cmd.code}
        return true;
    }

    public double tryParseDouble(String s) {
        try { return Double.parseDouble(s); } catch (Exception e) { return 0; }
    }
}
`;
        generatedFiles[className + '.java'] = fileContent;
    });

    // 4. Build plugin.yml
    const cmdNames = commands.map(c => c.name);
    generatedFiles['plugin.yml'] = generatePluginYmlLocal(projectNameRaw, version, cmdNames, authorRaw, packageName);

    // 5. Build pom.xml (Maven)
    generatedFiles['pom.xml'] = generatePomXml(packageName, projectNameRaw, version);

    // Update UI
    updateTabs();
    showFile(currentFile);
    saveState(); // Auto-save on generate
};

// Generate Basic POM
const generatePomXml = (groupId, artifactId, version) => {
    return `<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>${groupId}</groupId>
    <artifactId>${artifactId}</artifactId>
    <version>${version}</version>
    <packaging>jar</packaging>

    <name>${artifactId}</name>

    <properties>
        <java.version>21</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.13.0</version>
                <configuration>
                    <source>\${java.version}</source>
                    <target>\${java.version}</target>
                </configuration>
            </plugin>
        </plugins>
    </build>

    <repositories>
        <repository>
            <id>papermc-repo</id>
            <url>https://repo.papermc.io/repository/maven-public/</url>
        </repository>
    </repositories>

    <dependencies>
        <dependency>
            <groupId>io.papermc.paper</groupId>
            <artifactId>paper-api</artifactId>
            <version>1.21.4-R0.1-SNAPSHOT</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</project>`;
};

// Local override for YML to support dynamic package
const generatePluginYmlLocal = (projectName, version, commands, author, packageName) => {
    let yml = `name: ${projectName}
version: ${version}
main: ${packageName}.Main
api-version: 1.21
author: ${author || 'Unknown'}
`;

    if (commands && commands.length > 0) {
        yml += `commands:\n`;
        commands.forEach(cmd => {
            yml += `  ${cmd}:\n`;
            yml += `    description: Auto-generated command ${cmd}\n`;
            yml += `    usage: /${cmd}\n`;
        });
    }
    return yml;
};

// --- DOWNLOAD LOGIC ---

const downloadProject = () => {
    const zip = new JSZip();
    const projectName = document.getElementById('project-name').value || "MyPlugin";
    const folder = zip.folder(projectName);

    // Source Folder
    const srcFolder = folder.folder("src").folder("main");
    const javaFolder = srcFolder.folder("java").folder(currentPackagePath);
    const resourcesFolder = srcFolder.folder("resources");

    // Add Files
    Object.keys(generatedFiles).forEach(filename => {
        if (filename.endsWith(".java")) {
            javaFolder.file(filename, generatedFiles[filename]);
        } else if (filename === "plugin.yml") {
            resourcesFolder.file(filename, generatedFiles[filename]);
        } else if (filename === "pom.xml") {
            folder.file(filename, generatedFiles[filename]);
        }
    });

    // Generate ZIP
    zip.generateAsync({type:"blob"}).then(function(content) {
        // Create fake link to download
        const a = document.createElement("a");
        a.href = URL.createObjectURL(content);
        a.download = `${projectName}.zip`;
        a.click();
    });
};

// --- SAVE / LOAD STATE ---

const saveState = () => {
    const state = Blockly.serialization.workspaces.save(workspace);
    localStorage.setItem('blocklyWorkspace', JSON.stringify(state));
    
    // Save Meta
    localStorage.setItem('projectMeta', JSON.stringify({
        name: document.getElementById('project-name').value,
        author: document.getElementById('project-author').value,
        version: document.getElementById('project-version').value
    }));
};

const loadState = () => {
    const state = localStorage.getItem('blocklyWorkspace');
    if (state) {
        Blockly.serialization.workspaces.load(JSON.parse(state), workspace);
    }
    
    const meta = localStorage.getItem('projectMeta');
    if (meta) {
        const m = JSON.parse(meta);
        if (m.name) document.getElementById('project-name').value = m.name;
        if (m.author) document.getElementById('project-author').value = m.author;
        if (m.version) document.getElementById('project-version').value = m.version;
    }
};


// --- UI LOGIC ---

const updateTabs = () => {
    const tabContainer = document.getElementById('file-tabs');
    tabContainer.innerHTML = '';

    Object.keys(generatedFiles).forEach(filename => {
        const btn = document.createElement('button');
        btn.innerText = filename;
        btn.className = `px-4 py-3 text-sm font-medium focus:outline-none whitespace-nowrap transition-colors ${
            filename === currentFile 
            ? 'text-green-500 border-b-2 border-green-500 bg-gray-900' 
            : 'text-gray-400 hover:text-gray-200 border-b-2 border-transparent'
        }`;
        btn.onclick = () => {
            currentFile = filename;
            showFile(filename);
            updateTabs(); // Re-render to update active state
        };
        tabContainer.appendChild(btn);
    });
};

const showFile = (filename) => {
    // If file doesn't exist (e.g. deleted command), default to Main.java
    if (!generatedFiles[filename]) {
        currentFile = 'Main.java';
        filename = 'Main.java';
    }
    
    const codeArea = document.getElementById('code-output');
    codeArea.value = generatedFiles[filename] || "";
    
    // Update footer path
    let path = "";
    if (filename === 'plugin.yml') path = 'src/main/resources/plugin.yml';
    else if (filename === 'pom.xml') path = 'pom.xml';
    else path = `src/main/java/${currentPackagePath}/${filename}`;
    
    document.getElementById('file-path-footer').innerText = path;
};

// Event Listeners
document.getElementById('btn-generate').onclick = generateCode;
document.getElementById('btn-download').onclick = downloadProject;

workspace.addChangeListener(Blockly.Events.disableOrphans);

// Real-time Code Generation
const liveGenerator = debounce((event) => {
    // Don't generate on UI events (clicks, scrolling) to save performance
    if (event.type === Blockly.Events.UI) return;
    generateCode();
}, 200);

workspace.addChangeListener(liveGenerator);

// Initial Run
loadState(); // Load previous work
generateCode(); // Generate initial code

// Window Resize Fix for Blockly
window.addEventListener('resize', () => {
    Blockly.svgResize(workspace);
});
