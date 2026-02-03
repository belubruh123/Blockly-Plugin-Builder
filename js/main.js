import { defineBlocks } from './blocks_def.js';
import { initJavaGenerator } from './generator_java.js';
import { generatePluginYml } from './generator_yml.js';
import { loadDynamicBlocks } from './block_loader.js';
import { API_DATA } from './api_data.js';

// Initialize Blocks (Legacy + Dynamic)
defineBlocks(API_DATA);
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

// --- DYNAMIC TOOLBOX GENERATION (Categorized) ---
const generateToolbox = () => {
    // Safety check
    if (!API_DATA) return { "kind": "categoryToolbox", "contents": [] };
    const { enums, events, methods, context_getters } = API_DATA;
    const showApi = document.getElementById('toggle-api').checked;

    const contents = [];
    
    // Helper to add category
    const addCategory = (name, color, customContents = []) => {
        contents.push({
            "kind": "category",
            "name": name,
            "colour": color,
            "contents": customContents
        });
    };

    // 1. EVENTS
    const eventsCat = [];
    eventsCat.push({ "kind": "block", "type": "ez_event_master" });
    eventsCat.push({ "kind": "label", "text": "Event Data", "web-class": "toolbox-label" });
    // Add specific getters for events
    context_getters.filter(c => c.contexts.some(ctx => ctx.includes("Event"))).forEach(ctx => {
        const blockType = `paper_ctx_${ctx.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        eventsCat.push({ "kind": "block", "type": blockType });
    });
    // Add old helpers
    eventsCat.push({ "kind": "block", "type": "ez_val_victim" });
    eventsCat.push({ "kind": "block", "type": "ez_val_attacker" });
    
    addCategory("Events", "230", eventsCat);

    // 2. ACTIONS
    const actionsCat = [];
    actionsCat.push({
        "kind": "block", "type": "ez_action_message",
        "inputs": { "MSG": { "shadow": { "type": "text_string", "fields": { "TEXT": "Hello!" } } } }
    });
    actionsCat.push({
        "kind": "block", "type": "ez_action_broadcast",
        "inputs": { "MSG": { "shadow": { "type": "text_string", "fields": { "TEXT": "Alert!" } } } }
    });
    actionsCat.push({
        "kind": "block", "type": "ez_action_title",
        "inputs": {
            "TITLE": { "shadow": { "type": "text_string", "fields": { "TEXT": "Welcome" } } },
            "SUBTITLE": { "shadow": { "type": "text_string", "fields": { "TEXT": "Enjoy the server" } } }
        }
    });
    actionsCat.push({
        "kind": "block", "type": "ez_action_set_tablist",
        "inputs": {
            "HEADER": { "shadow": { "type": "text_string", "fields": { "TEXT": "Welcome!" } } },
            "FOOTER": { "shadow": { "type": "text_string", "fields": { "TEXT": "play.myserver.com" } } }
        }
    });
    actionsCat.push({
        "kind": "block", "type": "ez_action_bossbar_show_timed",
        "inputs": {
            "TITLE": { "shadow": { "type": "text_string", "fields": { "TEXT": "Boss Info" } } },
            "SECONDS": { "shadow": { "type": "math_number", "fields": { "NUM": 10 } } }
        }
    });
    actionsCat.push({
        "kind": "block", "type": "ez_action_scoreboard_set",
        "inputs": {
            "TITLE": { "shadow": { "type": "text_string", "fields": { "TEXT": "Stats" } } },
            "LINE1": { "shadow": { "type": "text_string", "fields": { "TEXT": "Coins" } } },
            "SCORE1": { "shadow": { "type": "math_number", "fields": { "NUM": 100 } } },
            "LINE2": { "shadow": { "type": "text_string", "fields": { "TEXT": "Kills" } } },
            "SCORE2": { "shadow": { "type": "math_number", "fields": { "NUM": 0 } } }
        }
    });

    actionsCat.push({ "kind": "block", "type": "ez_action_sound" });
    actionsCat.push({ "kind": "block", "type": "ez_action_particle" });
    actionsCat.push({
        "kind": "block", "type": "ez_action_log",
        "inputs": { "MSG": { "shadow": { "type": "text_string", "fields": { "TEXT": "Debug info" } } } }
    });
    actionsCat.push({ "kind": "block", "type": "ez_action_console_command" });
    
    addCategory("Actions", "160", actionsCat);
    
    // Commands
    const cmdCat = [];
    cmdCat.push({ "kind": "block", "type": "paper_command" });
    cmdCat.push({ "kind": "block", "type": "paper_command_arg_get" });
    cmdCat.push({ "kind": "block", "type": "paper_command_args_length" });
    // Add command context getters
    context_getters.filter(c => c.contexts.some(ctx => ctx.includes("Command"))).forEach(ctx => {
        const blockType = `paper_ctx_${ctx.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        cmdCat.push({ "kind": "block", "type": blockType });
    });

    addCategory("Commands", "120", cmdCat);

    // 3. PLAYER
    const playerCat = [];
    playerCat.push({ "kind": "block", "type": "ez_val_me" });
    playerCat.push({
        "kind": "block", "type": "ez_val_player_by_name",
        "inputs": { "NAME": { "shadow": { "type": "text_string", "fields": { "TEXT": "Steve" } } } }
    });
    playerCat.push({ "kind": "block", "type": "ez_val_player_ping" });
    playerCat.push({
        "kind": "block", "type": "ez_action_give",
        "inputs": { "AMOUNT": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } } }
    });
    playerCat.push({ "kind": "block", "type": "ez_action_inventory_clear" });
    playerCat.push({ "kind": "block", "type": "ez_action_inventory_has" });
    
    playerCat.push({
        "kind": "block", "type": "ez_action_set_health",
        "inputs": { "HEALTH": { "shadow": { "type": "math_number", "fields": { "NUM": 20 } } } }
    });
    playerCat.push({ "kind": "block", "type": "ez_action_toggle_flight" });
    playerCat.push({ "kind": "block", "type": "ez_action_set_gamemode" });
    playerCat.push({ "kind": "block", "type": "ez_action_launch_projectile" });

    // Effects
    playerCat.push({
        "kind": "block", "type": "ez_action_effect_add",
        "inputs": {
            "DURATION": { "shadow": { "type": "math_number", "fields": { "NUM": 10 } } },
            "AMPLIFIER": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } }
        }
    });
    playerCat.push({ "kind": "block", "type": "ez_action_effect_clear" });

    // Attributes
    playerCat.push({
        "kind": "block", "type": "paper_action_set_attribute",
        "inputs": { "VALUE": { "shadow": { "type": "math_number", "fields": { "NUM": 0 } } } }
    });
    playerCat.push({
        "kind": "block", "type": "ez_action_attribute_change",
        "inputs": { "AMOUNT": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } } }
    });
    playerCat.push({ "kind": "block", "type": "ez_expr_attribute_get" });

    // Admin
    playerCat.push({ "kind": "block", "type": "ez_action_ban" });
    playerCat.push({ "kind": "block", "type": "ez_action_kick" });
    
    addCategory("Player", "290", playerCat);

    // 4. WORLD
    const worldCat = [];
    worldCat.push({ "kind": "block", "type": "ez_action_teleport" });
    worldCat.push({ "kind": "block", "type": "ez_action_replace_block" });
    worldCat.push({ "kind": "block", "type": "ez_action_spawn_lightning" });
    worldCat.push({
        "kind": "block", "type": "ez_action_explosion",
        "inputs": { "POWER": { "shadow": { "type": "math_number", "fields": { "NUM": 4 } } } }
    });
    worldCat.push({ "kind": "block", "type": "ez_action_set_time" });
    worldCat.push({ "kind": "block", "type": "ez_action_set_weather" });
    
    worldCat.push({ "kind": "block", "type": "ez_val_location_of" });
    worldCat.push({
        "kind": "block", "type": "ez_val_coords",
        "inputs": {
            "X": { "shadow": { "type": "math_number", "fields": { "NUM": 0 } } },
            "Y": { "shadow": { "type": "math_number", "fields": { "NUM": 0 } } },
            "Z": { "shadow": { "type": "math_number", "fields": { "NUM": 0 } } }
        }
    });
    addCategory("World", "30", worldCat);

    // 5. CONTROL
    const controlCat = [];
    controlCat.push({
        "kind": "block", "type": "ez_control_wait",
        "inputs": { "SECONDS": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } } }
    });
    controlCat.push({ "kind": "block", "type": "controls_if" });
    controlCat.push({ "kind": "block", "type": "controls_repeat_ext", "inputs": { "TIMES": { "shadow": { "type": "math_number", "fields": { "NUM": 10 } } } } });
    controlCat.push({ "kind": "block", "type": "controls_whileUntil" });
    controlCat.push({ "kind": "block", "type": "controls_for_simple", "inputs": { "FROM": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } }, "TO": { "shadow": { "type": "math_number", "fields": { "NUM": 10 } } } } });
    controlCat.push({ "kind": "block", "type": "java_if" });
    
    addCategory("Control", "210", controlCat);

    // 6. DATA (Variables)
    const dataCat = [];
    dataCat.push({ "kind": "block", "type": "var_declare_typed" });
    dataCat.push({ "kind": "block", "type": "var_set_typed" });
    dataCat.push({ "kind": "block", "type": "var_get_typed" });
    dataCat.push({ "kind": "block", "type": "ez_data_set_global" });
    dataCat.push({ "kind": "block", "type": "ez_data_get_global" });
    dataCat.push({ "kind": "block", "type": "ez_val_server_tps" });
    dataCat.push({ "kind": "block", "type": "logic_is_type" });
    
    dataCat.push({ "kind": "block", "type": "lists_create_new" });
    dataCat.push({ "kind": "block", "type": "lists_add" });
    dataCat.push({ "kind": "block", "type": "lists_get_index" });
    dataCat.push({ "kind": "block", "type": "lists_size" });

    addCategory("Data", "330", dataCat);

    // 7. MATH
    const mathCat = [];
    mathCat.push({ "kind": "block", "type": "math_number" });
    mathCat.push({ "kind": "block", "type": "math_arithmetic" });
    mathCat.push({ "kind": "block", "type": "logic_compare" });
    mathCat.push({ "kind": "block", "type": "logic_operation" });
    mathCat.push({ "kind": "block", "type": "logic_boolean" });
    mathCat.push({ "kind": "block", "type": "java_math_op" });
    mathCat.push({ "kind": "block", "type": "java_logic_compare" });
    mathCat.push({ "kind": "block", "type": "ez_convert_to_number" });

    addCategory("Math", "230", mathCat);

    // 8. TEXT
    const textCat = [];
    textCat.push({ "kind": "block", "type": "text_string" });
    textCat.push({ "kind": "block", "type": "ez_convert_to_string" });
    addCategory("Text", "160", textCat);

    // 9. FILES
    const filesCat = [];
    filesCat.push({ "kind": "block", "type": "ez_config_set" });
    filesCat.push({ "kind": "block", "type": "ez_config_get" });
    addCategory("Files", "290", filesCat);
    
    // 10. ADMIN
    const adminCat = [];
    adminCat.push({
        "kind": "block", "type": "ez_action_kick_all",
        "inputs": { "REASON": { "shadow": { "type": "text_string", "fields": { "TEXT": "Maintenance" } } } }
    });
    adminCat.push({ "kind": "block", "type": "ez_action_stop_server" });
    addCategory("Admin", "0", adminCat);

    // --- API CATEGORIES (Hidden by default) ---
    if (showApi) {
        const apiCat = [];
        
        // Enums
        const enumCat = [];
        Object.keys(enums).forEach(e => {
            enumCat.push({ "kind": "block", "type": `paper_enum_${e.toLowerCase()}` });
        });
        addCategory("API: Enums", "60", enumCat);

        // Methods by Target
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
            
            addCategory(`API: ${target}`, color, methodsByTarget[target]);
        });
    }

    return { "kind": "categoryToolbox", "contents": contents };
};

// Toggle Listener
document.getElementById('toggle-api').addEventListener('change', () => {
    workspace.updateToolbox(generateToolbox());
});

// --- SEARCH LOGIC (Updated for Category Toolbox) ---
const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    
    // For category toolbox, we can't easily filter "in place" without rebuilding structure.
    // If search term exists, switch to a Flyout (Flat) of matches?
    // Or filter items within categories.
    
    if (!term) {
        workspace.updateToolbox(generateToolbox());
        return;
    }

    const fullToolbox = generateToolbox();
    const flatContents = [];

    // Helper to extract blocks recursively
    const extractBlocks = (itemList) => {
        itemList.forEach(item => {
            if (item.kind === "block") {
                let match = item.type.toLowerCase().includes(term);
                
                // Try to get the block definition to search its text
                if (!match) {
                    try {
                        const blockDef = Blockly.Blocks[item.type];
                        if (blockDef) {
                            // Create a temporary block to get its text
                            const tempBlock = workspace.newBlock(item.type);
                            const blockText = tempBlock.toString().toLowerCase();
                            tempBlock.dispose();
                            if (blockText.includes(term)) match = true;
                        }
                    } catch (e) {
                        // Ignore errors from blocks that can't be instantiated
                    }
                }
                
                // Special handling for API blocks
                if (!match && item.type.startsWith('paper_method_')) {
                     const apiName = item.type.replace('paper_method_', '').replace(/_/g, ' ');
                     if (apiName.includes(term)) match = true;
                }
                
                if (match) flatContents.push(item);
            } else if (item.kind === "category") {
                extractBlocks(item.contents);
            }
        });
    };
    
    extractBlocks(fullToolbox.contents);
    
    // Show flat results
    if (flatContents.length > 0) {
        workspace.updateToolbox({ "kind": "flyoutToolbox", "contents": flatContents });
    } else {
        // Show empty
        workspace.updateToolbox({ "kind": "flyoutToolbox", "contents": [] });
    }
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
            'flyoutBackgroundColour': '#111827', // Match toolbox
            'flyoutOpacity': 1,
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
    try {
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
            if (block.type.startsWith('paper_event_') || block.type === 'ez_event_master') { 
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

    } catch (e) {
        console.error("Generation Error:", e);
        document.getElementById('code-output').value = "// Error generating code:\n// " + e.message + "\n// Check console for details.";
    }
};

// Generate Basic POM
const generatePomXml = (groupId, artifactId, version) => {
    return 
`<project xmlns="http://maven.apache.org/POM/4.0.0"\n         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">\n    <modelVersion>4.0.0</modelVersion>\n\n    <groupId>
        ${groupId}</groupId>\n    <artifactId>${artifactId}</artifactId>\n    <version>${version}</version>\n    <packaging>jar</packaging>\n\n    <name>${artifactId}</name>\n\n    <properties>\n        <java.version>21</java.version>\n        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>\n    </properties>\n\n    <build>\n        <plugins>\n            <plugin>\n                <groupId>org.apache.maven.plugins</groupId>\n                <artifactId>maven-compiler-plugin</artifactId>\n                <version>3.13.0</version>\n                <configuration>\n                    <source>\
                        ${java.version}</source>\n                    <target>\
                        ${java.version}</target>\n                </configuration>\n            </plugin>\n        </plugins>\n    </build>\n\n    <repositories>\n        <repository>\n            <id>papermc-repo</id>\n            <url>https://repo.papermc.io/repository/maven-public/</url>\n        </repository>\n    </repositories>\n\n    <dependencies>\n        <dependency>\n            <groupId>io.papermc.paper</groupId>\n            <artifactId>paper-api</artifactId>\n            <version>1.21.4-R0.1-SNAPSHOT</version>\n            <scope>provided</scope>\n        </dependency>\n    </dependencies>\n</project>
`;
};

// Local override for YML to support dynamic package
const generatePluginYmlLocal = (projectName, version, commands, author, packageName) => {
    let yml = 
`name: ${projectName}
version: ${version}
main: ${packageName}.Main
api-version: 1.21
author: ${author || 'Unknown'}
`;

    if (commands && commands.length > 0) {
        yml += 
`commands:
`;
        commands.forEach(cmd => {
            yml += 
`  ${cmd}:
`;
            yml += 
`    description: Auto-generated command ${cmd}
`;
            yml += 
`    usage: /${cmd}
`;
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
        btn.className = `px-4 py-3 text-sm font-medium focus:outline-none whitespace-nowrap transition-colors ${filename === currentFile ? 'text-green-500 border-b-2 border-green-500 bg-gray-900' : 'text-gray-400 hover:text-gray-200 border-b-2 border-transparent'}`;
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
