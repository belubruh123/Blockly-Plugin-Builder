// Java Generator logic

export const initJavaGenerator = () => {
    const javaGenerator = new Blockly.Generator('JAVA');

    // Order of operations (simplified for Java)
    javaGenerator.ORDER_ATOMIC = 0;
    javaGenerator.ORDER_NONE = 99;

    // --- UTILS ---
    javaGenerator.scrub_ = function(block, code, opt_thisOnly) {
        const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
        const nextCode = opt_thisOnly ? '' : javaGenerator.blockToCode(nextBlock);
        return code + nextCode;
    };

    // --- STANDARD LOGIC & FLOW ---

    // IF/ELSE
    javaGenerator.forBlock['controls_if'] = function(block) {
        let n = 0;
        let code = '';
        if (javaGenerator.STATEMENT_PREFIX) {
            code += javaGenerator.injectId(javaGenerator.STATEMENT_PREFIX, block);
        }
        
        // If
        let argument = javaGenerator.valueToCode(block, 'IF' + n, javaGenerator.ORDER_NONE) || 'false';
        let branch = javaGenerator.statementToCode(block, 'DO' + n);
        code += `if (${argument}) {\n${branch}}`;
        
        // Else If
        for (n = 1; n <= block.elseifCount_; n++) {
            argument = javaGenerator.valueToCode(block, 'IF' + n, javaGenerator.ORDER_NONE) || 'false';
            branch = javaGenerator.statementToCode(block, 'DO' + n);
            code += ` else if (${argument}) {\n${branch}}`;
        }
        
        // Else
        if (block.elseCount_) {
            branch = javaGenerator.statementToCode(block, 'ELSE');
            code += ` else {\n${branch}}`;
        }
        return code + '\n';
    };

    // LOOPS
    javaGenerator.forBlock['controls_repeat_ext'] = function(block) {
        const repeats = javaGenerator.valueToCode(block, 'TIMES', javaGenerator.ORDER_NONE) || '0';
        const branch = javaGenerator.statementToCode(block, 'DO');
        const loopVar = javaGenerator.nameDB_ ? javaGenerator.nameDB_.getDistinctName('i', 'VARIABLE') : 'i';
        return `for (int ${loopVar} = 0; ${loopVar} < ${repeats}; ${loopVar}++) {\n${branch}}\n`;
    };
    
    // WHILE
    javaGenerator.forBlock['controls_whileUntil'] = function(block) {
        const mode = block.getFieldValue('MODE');
        const argument = javaGenerator.valueToCode(block, 'BOOL', javaGenerator.ORDER_NONE) || 'false';
        const branch = javaGenerator.statementToCode(block, 'DO');
        if (mode === 'UNTIL') {
            return `while (!(${argument})) {\n${branch}}\n`;
        }
        return `while (${argument}) {\n${branch}}\n`;
    };

    // MATH
    javaGenerator.forBlock['math_number'] = function(block) {
        return [String(block.getFieldValue('NUM')), javaGenerator.ORDER_ATOMIC];
    };

    javaGenerator.forBlock['math_arithmetic'] = function(block) {
        const OPERATORS = {
            'ADD': [' + ', javaGenerator.ORDER_NONE],
            'MINUS': [' - ', javaGenerator.ORDER_NONE],
            'MULTIPLY': [' * ', javaGenerator.ORDER_NONE],
            'DIVIDE': [' / ', javaGenerator.ORDER_NONE],
            'POWER': [' Math.pow(', ')'] // simplified
        };
        const tuple = OPERATORS[block.getFieldValue('OP')];
        const operator = tuple[0];
        const order = tuple[1];
        const argument0 = javaGenerator.valueToCode(block, 'A', order) || '0';
        const argument1 = javaGenerator.valueToCode(block, 'B', order) || '0';
        return [`${argument0}${operator}${argument1}`, order];
    };

    // LOGIC
    javaGenerator.forBlock['logic_compare'] = function(block) {
        const OPERATORS = {
            'EQ': '==',
            'NEQ': '!=',
            'LT': '<',
            'LTE': '<=',
            'GT': '>',
            'GTE': '>='
        };
        const operator = OPERATORS[block.getFieldValue('OP')];
        const argument0 = javaGenerator.valueToCode(block, 'A', javaGenerator.ORDER_NONE) || '0';
        const argument1 = javaGenerator.valueToCode(block, 'B', javaGenerator.ORDER_NONE) || '0';
        return [`${argument0} ${operator} ${argument1}`, javaGenerator.ORDER_NONE];
    };

    javaGenerator.forBlock['logic_operation'] = function(block) {
        const operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
        const argument0 = javaGenerator.valueToCode(block, 'A', javaGenerator.ORDER_NONE) || 'false';
        const argument1 = javaGenerator.valueToCode(block, 'B', javaGenerator.ORDER_NONE) || 'false';
        return [`${argument0} ${operator} ${argument1}`, javaGenerator.ORDER_NONE];
    };
    
    javaGenerator.forBlock['logic_boolean'] = function(block) {
        const code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
        return [code, javaGenerator.ORDER_ATOMIC];
    };
    
    javaGenerator.forBlock['logic_negate'] = function(block) {
        const argument0 = javaGenerator.valueToCode(block, 'BOOL', javaGenerator.ORDER_NONE) || 'true';
        return ['!' + argument0, javaGenerator.ORDER_NONE];
    };

    javaGenerator.forBlock['logic_is_type'] = function(block) {
        const obj = javaGenerator.valueToCode(block, 'OBJECT', javaGenerator.ORDER_ATOMIC) || 'null';
        const type = block.getFieldValue('TYPE');
        return [`(${obj} instanceof ${type})`, javaGenerator.ORDER_ATOMIC];
    };

    // VARIABLES (Typed)
    javaGenerator.forBlock['var_declare_typed'] = function(block) {
        const type = block.getFieldValue('TYPE');
        const name = block.getFieldValue('VAR_NAME');
        const val = javaGenerator.valueToCode(block, 'VALUE', javaGenerator.ORDER_NONE) || 'null';
        return `${type} ${name} = ${val};\n`;
    };

    javaGenerator.forBlock['var_get_typed'] = function(block) {
        const name = block.getFieldValue('VAR_NAME');
        return [name, javaGenerator.ORDER_ATOMIC];
    };

    javaGenerator.forBlock['var_set_typed'] = function(block) {
        const name = block.getFieldValue('VAR_NAME');
        const val = javaGenerator.valueToCode(block, 'VALUE', javaGenerator.ORDER_NONE) || 'null';
        return `${name} = ${val};\n`;
    };

    // --- EASY MODE: SMART GENERATORS ---

    // Helper: Guess 'Me' based on context
    const getSmartMe = (block) => {
        let root = block.getRootBlock();
        if (!root) return "event.getPlayer()"; // Default if orphaned
        
        if (root.type === 'paper_command') {
            return "sender"; // CommandSender
        } else if (root.type && root.type.startsWith('paper_event')) {
            // Check event type for specificity? For now default to player
            return "event.getPlayer()";
        }
        return "event.getPlayer()";
    };

    javaGenerator.forBlock['ez_val_me'] = function(block) {
        return [getSmartMe(block), javaGenerator.ORDER_ATOMIC];
    };

    javaGenerator.forBlock['ez_action_message'] = function(block) {
        const msg = javaGenerator.valueToCode(block, 'MSG', javaGenerator.ORDER_NONE) || '""';
        let target = javaGenerator.valueToCode(block, 'TARGET', javaGenerator.ORDER_ATOMIC);
        
        if (!target) target = getSmartMe(block); // Default to Me

        // Safety Wrapper
        // We simply call sendMessage. All CommandSender (Player, Console) have it.
        // But if target came from "Get Entity", it might be a Cow (which can't receive messages).
        // So we cast.
        
        return `        if (${target} instanceof CommandSender) {
            ((CommandSender) ${target}).sendMessage(Component.text(${msg}));
        }\n`;
    };

    javaGenerator.forBlock['ez_action_teleport'] = function(block) {
        let target = javaGenerator.valueToCode(block, 'TARGET', javaGenerator.ORDER_ATOMIC);
        if (!target) {
            // Smart Default: If command, we need to cast sender to Entity/Player
            let me = getSmartMe(block);
            if (me === "sender") {
                // We handle the cast inside the code block
                target = "((Player) sender)"; 
                // We will wrap the whole thing in "if sender is player"
            } else {
                target = me;
            }
        }

        const dest = javaGenerator.valueToCode(block, 'DESTINATION', javaGenerator.ORDER_ATOMIC) || 'null';
        
        // Logic to handle "Teleport to Entity" vs "Teleport to Location"
        // Java needs .getLocation() if it's an entity.
        // Since we don't have strict types at generation time easily, we can try to guess or use a helper method in Java?
        // Or simpler: We assume users follow the tooltip.
        // But for "Big Jump" safety, let's just generate strict code for Location.
        // If the user connects an Entity to "DESTINATION", we should have a "Location of" block in between.
        // BUT, for ease of use, let's try to support direct Entity connection if we can? 
        // No, let's stick to Location input for now to ensure valid Java.
        
        let code = `        if (${target} instanceof Entity) {
            ((Entity) ${target}).teleport(${dest});
        }\n`;
        
        // If implicit "Me" in command, add safety
        if (getSmartMe(block) === "sender" && target.includes("sender")) {
             return `        if (sender instanceof Player) {
        ${code}        }\n`;
        }
        
        return code;
    };

    javaGenerator.forBlock['ez_action_give'] = function(block) {
        let target = javaGenerator.valueToCode(block, 'TARGET', javaGenerator.ORDER_ATOMIC);
        const item = block.getFieldValue('ITEM');
        const amount = javaGenerator.valueToCode(block, 'AMOUNT', javaGenerator.ORDER_NONE) || '1';

        if (!target) {
             let me = getSmartMe(block);
             if (me === "sender") target = "((Player) sender)";
             else target = me;
        }

        let code = `        if (${target} instanceof Player) {
            ((Player) ${target}).getInventory().addItem(new ItemStack(Material.${item}, ${amount}));
        }\n`;
        
        if (getSmartMe(block) === "sender" && target.includes("sender")) {
             return `        if (sender instanceof Player) {
        ${code}        }\n`;
        }
        return code;
    };

    javaGenerator.forBlock['ez_action_broadcast'] = function(block) {
        const msg = javaGenerator.valueToCode(block, 'MSG', javaGenerator.ORDER_NONE) || '""';
        return `        Bukkit.broadcast(Component.text(${msg}));\n`;
    };

    javaGenerator.forBlock['ez_action_log'] = function(block) {
        const msg = javaGenerator.valueToCode(block, 'MSG', javaGenerator.ORDER_NONE) || '""';
        return `        Bukkit.getLogger().info(${msg});\n`;
    };

    javaGenerator.forBlock['ez_val_location_of'] = function(block) {
        const entity = javaGenerator.valueToCode(block, 'ENTITY', javaGenerator.ORDER_ATOMIC) || 'null';
        return [`${entity}.getLocation()`, javaGenerator.ORDER_ATOMIC];
    };

    javaGenerator.forBlock['ez_val_coords'] = function(block) {
        const x = javaGenerator.valueToCode(block, 'X', javaGenerator.ORDER_ATOMIC) || '0';
        const y = javaGenerator.valueToCode(block, 'Y', javaGenerator.ORDER_ATOMIC) || '0';
        const z = javaGenerator.valueToCode(block, 'Z', javaGenerator.ORDER_ATOMIC) || '0';
        
        // We need a world. Smart default to context world.
        let worldCode = "null";
        let root = block.getRootBlock();
        if (root.type === 'paper_command') {
             worldCode = "((Player) sender).getWorld()"; // Unsafe if console, but standard for relative coords
        } else {
             worldCode = "event.getPlayer().getWorld()";
        }
        
        return [`new Location(${worldCode}, ${x}, ${y}, ${z})`, javaGenerator.ORDER_ATOMIC];
    };

    // Helper for Smart Locations
    const generateSmartLoc = (targetCode) => {
        // Generates Java Ternary to handle both Entity (get location) and Location objects
        return `(${targetCode} instanceof Entity ? ((Entity)${targetCode}).getLocation() : (Location)${targetCode})`;
    };

    // 7. REPLACE BLOCK
    javaGenerator.forBlock['ez_action_replace_block'] = function(block) {
        let location = javaGenerator.valueToCode(block, 'LOCATION', javaGenerator.ORDER_ATOMIC);
        const material = block.getFieldValue('MATERIAL');
        
        if (!location) {
             let me = getSmartMe(block);
             if (me === "sender") location = "((Player)sender).getLocation()";
             else location = `${me}.getLocation()`;
        } else {
            location = generateSmartLoc(location);
        }

        let code = `        ${location}.getBlock().setType(Material.${material});\n`;

        if (getSmartMe(block) === "sender" && location.includes("sender")) {
             return `        if (sender instanceof Player) {
            ${code}        }\n`;
        }
        return code;
    };

    // 8. LIGHTNING
    javaGenerator.forBlock['ez_action_spawn_lightning'] = function(block) {
        let location = javaGenerator.valueToCode(block, 'LOCATION', javaGenerator.ORDER_ATOMIC);
        if (!location) {
             let me = getSmartMe(block);
             if (me === "sender") location = "((Player)sender).getLocation()";
             else location = `${me}.getLocation()`;
        } else {
             location = generateSmartLoc(location);
        }
        
        let code = `        ${location}.getWorld().strikeLightning(${location});\n`;
        
        if (getSmartMe(block) === "sender" && location.includes("sender")) {
             return `        if (sender instanceof Player) {
            ${code}        }\n`;
        }
        return code;
    };

    // 9. EXPLOSION
    javaGenerator.forBlock['ez_action_explosion'] = function(block) {
        let location = javaGenerator.valueToCode(block, 'LOCATION', javaGenerator.ORDER_ATOMIC);
        const power = javaGenerator.valueToCode(block, 'POWER', javaGenerator.ORDER_NONE) || '4';

        if (!location) {
             let me = getSmartMe(block);
             if (me === "sender") location = "((Player)sender).getLocation()";
             else location = `${me}.getLocation()`;
        } else {
             location = generateSmartLoc(location);
        }
        
        let code = `        ${location}.getWorld().createExplosion(${location}, ${power});\n`;
        
        if (getSmartMe(block) === "sender" && location.includes("sender")) {
             return `        if (sender instanceof Player) {
            ${code}        }\n`;
        }
        return code;
    };

    // 10. TITLE
    javaGenerator.forBlock['ez_action_title'] = function(block) {
        let target = javaGenerator.valueToCode(block, 'TARGET', javaGenerator.ORDER_ATOMIC);
        const title = javaGenerator.valueToCode(block, 'TITLE', javaGenerator.ORDER_NONE) || '""';
        const subtitle = javaGenerator.valueToCode(block, 'SUBTITLE', javaGenerator.ORDER_NONE) || '""';

        if (!target) target = getSmartMe(block); 
        
        let code = `        if (${target} instanceof Player) {
            ((Player)${target}).showTitle(net.kyori.adventure.title.Title.title(
                Component.text(${title}), 
                Component.text(${subtitle})
            ));
        }\n`;
        
        return code;
    };

    // 11. HEALTH
    javaGenerator.forBlock['ez_action_set_health'] = function(block) {
        let target = javaGenerator.valueToCode(block, 'TARGET', javaGenerator.ORDER_ATOMIC);
        const health = javaGenerator.valueToCode(block, 'HEALTH', javaGenerator.ORDER_NONE) || '20';
        
        if (!target) target = getSmartMe(block);

        let code = `        if (${target} instanceof org.bukkit.entity.Damageable) {
            ((org.bukkit.entity.Damageable)${target}).setHealth(${health});
        }\n`;
        return code;
    };

    // 12. FLIGHT
    javaGenerator.forBlock['ez_action_toggle_flight'] = function(block) {
        let target = javaGenerator.valueToCode(block, 'TARGET', javaGenerator.ORDER_ATOMIC);
        const state = block.getFieldValue('STATE'); 
        
        if (!target) target = getSmartMe(block);
        
        let code = `        if (${target} instanceof Player) {
            ((Player)${target}).setAllowFlight(${state.toLowerCase()});
        }\n`;
        return code;
    };

    // --- CONTROL ---
    javaGenerator.forBlock['ez_control_wait'] = function(block) {
        const seconds = javaGenerator.valueToCode(block, 'SECONDS', javaGenerator.ORDER_NONE) || '1';
        const branch = javaGenerator.statementToCode(block, 'DO');
        
        // 20 ticks = 1 second
        return `        new org.bukkit.scheduler.BukkitRunnable() {
            @Override
            public void run() {
${branch}
            }
        }.runTaskLater(Main.getPlugin(Main.class), (long)(${seconds} * 20));\n`;
    };

    // --- POTION EFFECTS ---
    javaGenerator.forBlock['ez_action_effect_add'] = function(block) {
        let target = javaGenerator.valueToCode(block, 'TARGET', javaGenerator.ORDER_ATOMIC);
        const effect = block.getFieldValue('EFFECT');
        const duration = javaGenerator.valueToCode(block, 'DURATION', javaGenerator.ORDER_NONE) || '10';
        const amplifier = javaGenerator.valueToCode(block, 'AMPLIFIER', javaGenerator.ORDER_NONE) || '1';
        
        if (!target) target = getSmartMe(block);

        return `        if (${target} instanceof LivingEntity) {
            ((LivingEntity)${target}).addPotionEffect(new org.bukkit.potion.PotionEffect(org.bukkit.potion.PotionEffectType.${effect}, (int)(${duration} * 20), (int)(${amplifier} - 1)));
        }\n`;
    };

    javaGenerator.forBlock['ez_action_effect_clear'] = function(block) {
        let target = javaGenerator.valueToCode(block, 'TARGET', javaGenerator.ORDER_ATOMIC);
        if (!target) target = getSmartMe(block);
        
        return `        if (${target} instanceof LivingEntity) {
            for (org.bukkit.potion.PotionEffect effect : ((LivingEntity)${target}).getActivePotionEffects()) {
                ((LivingEntity)${target}).removePotionEffect(effect.getType());
            }
        }\n`;
    };

    // --- GAMEMODE ---
    javaGenerator.forBlock['ez_action_set_gamemode'] = function(block) {
        let target = javaGenerator.valueToCode(block, 'TARGET', javaGenerator.ORDER_ATOMIC);
        const mode = block.getFieldValue('MODE');
        
        if (!target) target = getSmartMe(block);
        
        return `        if (${target} instanceof Player) {
            ((Player)${target}).setGameMode(GameMode.${mode});
        }\n`;
    };

    // --- PROJECTILE ---
    javaGenerator.forBlock['ez_action_launch_projectile'] = function(block) {
        let target = javaGenerator.valueToCode(block, 'TARGET', javaGenerator.ORDER_ATOMIC);
        const proj = block.getFieldValue('PROJ');
        
        if (!target) target = getSmartMe(block);
        
        return `        if (${target} instanceof LivingEntity) {
            ((LivingEntity)${target}).launchProjectile(${proj}.class);
        }\n`;
    };

    // --- INVENTORY ---
    javaGenerator.forBlock['ez_action_inventory_clear'] = function(block) {
        let target = javaGenerator.valueToCode(block, 'TARGET', javaGenerator.ORDER_ATOMIC);
        if (!target) target = getSmartMe(block);
        
        return `        if (${target} instanceof Player) {
            ((Player)${target}).getInventory().clear();
        }\n`;
    };

    javaGenerator.forBlock['ez_action_inventory_has'] = function(block) {
        let target = javaGenerator.valueToCode(block, 'TARGET', javaGenerator.ORDER_ATOMIC);
        const item = block.getFieldValue('ITEM');
        
        if (!target) target = getSmartMe(block);
        
        const code = `(${target} instanceof Player && ((Player)${target}).getInventory().contains(Material.${item}))`;
        return [code, javaGenerator.ORDER_ATOMIC];
    };

    // --- WORLD ---
    javaGenerator.forBlock['ez_action_set_time'] = function(block) {
        const time = block.getFieldValue('TIME');
        // Need a world. Use smart me context.
        return `        Bukkit.getWorlds().get(0).setTime(${time});\n`; // Default to main world for simplicity
    };

    javaGenerator.forBlock['ez_action_set_weather'] = function(block) {
        const weather = block.getFieldValue('WEATHER');
        const isStorm = (weather === "DOWNFALL" || weather === "THUNDER");
        const isThunder = (weather === "THUNDER");
        
        return `        Bukkit.getWorlds().get(0).setStorm(${isStorm});
        Bukkit.getWorlds().get(0).setThundering(${isThunder});\n`;
    };
    
    // --- SERVER ---
    javaGenerator.forBlock['ez_action_console_command'] = function(block) {
        const cmd = javaGenerator.valueToCode(block, 'CMD', javaGenerator.ORDER_NONE) || '""';
        return `        Bukkit.dispatchCommand(Bukkit.getConsoleSender(), ${cmd});\n`;
    };

    // --- LOOPS (For) ---
    javaGenerator.forBlock['controls_for_simple'] = function(block) {
        const variable = block.getFieldValue('VAR');
        const from = javaGenerator.valueToCode(block, 'FROM', javaGenerator.ORDER_NONE) || '0';
        const to = javaGenerator.valueToCode(block, 'TO', javaGenerator.ORDER_NONE) || '0';
        const branch = javaGenerator.statementToCode(block, 'DO');
        return `for (int ${variable} = (int)(${from}); ${variable} <= (int)(${to}); ${variable}++) {\n${branch}}\n`;
    };

    // --- LISTS ---
    javaGenerator.forBlock['lists_create_new'] = function(block) {
        // We use raw ArrayList for simplicity in this loose-typed env
        return [`new java.util.ArrayList<>()`, javaGenerator.ORDER_ATOMIC];
    };

    javaGenerator.forBlock['lists_add'] = function(block) {
        const list = javaGenerator.valueToCode(block, 'LIST', javaGenerator.ORDER_ATOMIC) || 'null';
        const item = javaGenerator.valueToCode(block, 'ITEM', javaGenerator.ORDER_NONE) || 'null';
        // Cast to List to be safe
        return `        if (${list} instanceof java.util.List) ((java.util.List)${list}).add(${item});\n`;
    };

    javaGenerator.forBlock['lists_get_index'] = function(block) {
        const list = javaGenerator.valueToCode(block, 'LIST', javaGenerator.ORDER_ATOMIC) || 'null';
        const index = javaGenerator.valueToCode(block, 'INDEX', javaGenerator.ORDER_NONE) || '0';
        return [`((java.util.List)${list}).get((int)(${index}))`, javaGenerator.ORDER_ATOMIC];
    };

    javaGenerator.forBlock['lists_size'] = function(block) {
        const list = javaGenerator.valueToCode(block, 'LIST', javaGenerator.ORDER_ATOMIC) || 'null';
        return [`((java.util.List)${list}).size()`, javaGenerator.ORDER_ATOMIC];
    };


    // --- PAPER SPECIFIC ---

    // --- EVENTS (Master) ---
    javaGenerator.forBlock['ez_event_master'] = function(block) {
        const eventType = block.getFieldValue('EVENT_TYPE');
        const statements = javaGenerator.statementToCode(block, 'DO');
        
        let eventClass = eventType;
        let eventPackage = ""; 

        // Map simplified names to actual classes/imports if needed
        // But our Main.java imports .event.player.*, .event.block.*, etc. so simple names often work.
        // Exception: AsyncChatEvent is in io.papermc...
        
        if (eventType === "ServerLoad") {
            // Special case: PluginEnableEvent
            return `
    @EventHandler
    public void onPluginEnable(org.bukkit.event.server.PluginEnableEvent event) {
        // Only run if it's THIS plugin
        if (event.getPlugin().equals(this)) {
${statements}
        }
    }
`;
        } else if (eventType === "AsyncChatEvent") {
             // Requires io.papermc import or FQN
             return `
    @EventHandler
    public void onChat(io.papermc.paper.event.player.AsyncChatEvent event) {
${statements}
    }
`;
        }

        // Default Generation
        return `
    @EventHandler
    public void on${eventType}(${eventType} event) {
${statements}
    }
`;
    };

    // --- DATA / CONTEXT ---
    javaGenerator.forBlock['ez_val_victim'] = function(block) {
        return ['event.getEntity()', javaGenerator.ORDER_ATOMIC];
    };

    javaGenerator.forBlock['ez_val_attacker'] = function(block) {
        // killer is nullable
        return ['event.getEntity().getKiller()', javaGenerator.ORDER_ATOMIC];
    };

    // --- CONFIG & GLOBAL DATA ---
    javaGenerator.forBlock['ez_config_set'] = function(block) {
        const path = javaGenerator.valueToCode(block, 'PATH', javaGenerator.ORDER_NONE) || '"data"';
        const val = javaGenerator.valueToCode(block, 'VALUE', javaGenerator.ORDER_NONE) || 'null';
        return `        Main.getPlugin(Main.class).getConfig().set(${path}, ${val});\n        Main.getPlugin(Main.class).saveConfig();\n`;
    };

    javaGenerator.forBlock['ez_config_get'] = function(block) {
        const path = javaGenerator.valueToCode(block, 'PATH', javaGenerator.ORDER_NONE) || '"data"';
        return [`Main.getPlugin(Main.class).getConfig().get(${path})`, javaGenerator.ORDER_ATOMIC];
    };

    javaGenerator.forBlock['ez_data_set_global'] = function(block) {
        const key = javaGenerator.valueToCode(block, 'KEY', javaGenerator.ORDER_NONE) || '"key"';
        const val = javaGenerator.valueToCode(block, 'VALUE', javaGenerator.ORDER_NONE) || 'null';
        // We assume Main.globalData exists (Map<String, Object>)
        return `        Main.globalData.put(String.valueOf(${key}), ${val});\n`;
    };

    javaGenerator.forBlock['ez_data_get_global'] = function(block) {
        const key = javaGenerator.valueToCode(block, 'KEY', javaGenerator.ORDER_NONE) || '"key"';
        return [`Main.globalData.get(String.valueOf(${key}))`, javaGenerator.ORDER_ATOMIC];
    };

    // --- CONVERTERS ---
    javaGenerator.forBlock['ez_convert_to_string'] = function(block) {
        const val = javaGenerator.valueToCode(block, 'VAL', javaGenerator.ORDER_NONE) || '""';
        return [`String.valueOf(${val})`, javaGenerator.ORDER_ATOMIC];
    };

    javaGenerator.forBlock['ez_convert_to_number'] = function(block) {
        const val = javaGenerator.valueToCode(block, 'VAL', javaGenerator.ORDER_NONE) || '"0"';
        // Safety wrapper for scratch kids
        return [`(tryParseDouble(String.valueOf(${val})))`, javaGenerator.ORDER_ATOMIC];
    };

    // --- NEW ACTIONS ---
    javaGenerator.forBlock['ez_action_ban'] = function(block) {
        let target = javaGenerator.valueToCode(block, 'TARGET', javaGenerator.ORDER_ATOMIC);
        const reason = javaGenerator.valueToCode(block, 'REASON', javaGenerator.ORDER_NONE) || '"Banned"';
        
        if (!target) target = getSmartMe(block);

        return `        if (${target} instanceof Player) {
            Bukkit.getBanList(org.bukkit.BanList.Type.NAME).addBan(((Player)${target}).getName(), ${reason}, null, null);
            ((Player)${target}).kick(Component.text(${reason}));
        }\n`;
    };

    javaGenerator.forBlock['ez_action_kick'] = function(block) {
        let target = javaGenerator.valueToCode(block, 'TARGET', javaGenerator.ORDER_ATOMIC);
        const reason = javaGenerator.valueToCode(block, 'REASON', javaGenerator.ORDER_NONE) || '"Kicked"';
        
        if (!target) target = getSmartMe(block);

        return `        if (${target} instanceof Player) {
            ((Player)${target}).kick(Component.text(${reason}));
        }\n`;
    };

    javaGenerator.forBlock['ez_action_sound'] = function(block) {
        let target = javaGenerator.valueToCode(block, 'TARGET', javaGenerator.ORDER_ATOMIC);
        const sound = block.getFieldValue('SOUND');
        
        if (!target) target = getSmartMe(block);
        
        // Handle Entity vs Location
        let locCode = generateSmartLoc(target);
        return `        ${locCode}.getWorld().playSound(${locCode}, Sound.${sound}, 1.0f, 1.0f);\n`;
    };

    javaGenerator.forBlock['ez_action_particle'] = function(block) {
        let target = javaGenerator.valueToCode(block, 'LOCATION', javaGenerator.ORDER_ATOMIC);
        const particle = block.getFieldValue('PARTICLE');
        
        if (!target) target = getSmartMe(block);
        let locCode = generateSmartLoc(target);
        
        return `        ${locCode}.getWorld().spawnParticle(Particle.${particle}, ${locCode}, 10);\n`;
    };

    // Dynamic Events
    // Note: The loop in main.js handles registering these, but we need a generic handler here if we didn't define them specifically.
    // However, main.js uses specific block types like 'paper_event_playerjoinevent'.
    // We need a catch-all or specific handlers. 
    // Since we are defining them dynamically in block_loader, we need to ensure their generator is attached.
    // *Correction*: In `block_loader.js`, we assign `generator.forBlock[...]`. 
    // This file `generator_java.js` initializes the generator instance. 
    // `block_loader` extends it. So we are good.

    // Commands
    javaGenerator.forBlock['paper_command'] = function(block) {
        const statements = javaGenerator.statementToCode(block, 'DO');
        return statements;
    };

    // Command Args
    javaGenerator.forBlock['paper_command_arg_get'] = function(block) {
        const index = javaGenerator.valueToCode(block, 'INDEX', javaGenerator.ORDER_NONE) || '0';
        return [`args[(int)${index}]`, javaGenerator.ORDER_ATOMIC];
    };

    javaGenerator.forBlock['paper_command_args_length'] = function(block) {
        return [`args.length`, javaGenerator.ORDER_ATOMIC];
    };

    // --- ACTIONS ---
    // (Legacy actions kept for compatibility, though API_DATA ones override usually)
    javaGenerator.forBlock['paper_action_send_message'] = function(block) {
        const msg = javaGenerator.valueToCode(block, 'MESSAGE', javaGenerator.ORDER_NONE) || '""';
        let root = block.getRootBlock();
        if (root.type === 'paper_command') {
            return `        sender.sendMessage(Component.text(${msg}));\n`;
        } else {
            return `        event.getPlayer().sendMessage(Component.text(${msg}));\n`;
        }
    };

    javaGenerator.forBlock['paper_action_give_item'] = function(block) {
        const material = block.getFieldValue('MATERIAL');
        const amount = javaGenerator.valueToCode(block, 'AMOUNT', javaGenerator.ORDER_NONE) || '1';
        let root = block.getRootBlock();
        if (root.type === 'paper_command') {
            return `        if (sender instanceof Player) {
            Player player = (Player) sender;
            player.getInventory().addItem(new ItemStack(Material.${material}, ${amount}));
        }\n`;
        } else {
             return `        event.getPlayer().getInventory().addItem(new ItemStack(Material.${material}, ${amount}));\n`;
        }
    };

    javaGenerator.forBlock['paper_action_teleport_spawn'] = function(block) {
        let root = block.getRootBlock();
        if (root.type === 'paper_command') {
             return `        if (sender instanceof Player) {
            Player player = (Player) sender;
            player.teleport(player.getWorld().getSpawnLocation());
        }\n`;
        } else {
            return `        event.getPlayer().teleport(event.getPlayer().getWorld().getSpawnLocation());\n`;
        }
    };

    javaGenerator.forBlock['paper_action_set_attribute'] = function(block) {
        const target = javaGenerator.valueToCode(block, 'TARGET', javaGenerator.ORDER_ATOMIC) || 'event.getPlayer()';
        const attr = block.getFieldValue('ATTRIBUTE');
        const value = javaGenerator.valueToCode(block, 'VALUE', javaGenerator.ORDER_NONE) || '0';
        
        // Cast to LivingEntity just in case (Player, Zombie, etc are LivingEntity)
        return `        if (${target} instanceof LivingEntity) {
            ((LivingEntity) ${target}).getAttribute(Attribute.${attr}).setBaseValue(${value});
        }\n`;
    };

    javaGenerator.forBlock['ez_action_attribute_change'] = function(block) {
        let target = javaGenerator.valueToCode(block, 'TARGET', javaGenerator.ORDER_ATOMIC);
        const attr = block.getFieldValue('ATTRIBUTE');
        const amount = javaGenerator.valueToCode(block, 'AMOUNT', javaGenerator.ORDER_NONE) || '0';
        
        if (!target) target = getSmartMe(block);

        // We need to safely get the attribute, check if not null, then add to base value
        return `        if (${target} instanceof LivingEntity) {
            org.bukkit.attribute.AttributeInstance attr = ((LivingEntity) ${target}).getAttribute(Attribute.${attr});
            if (attr != null) {
                attr.setBaseValue(attr.getBaseValue() + ${amount});
            }
        }\n`;
    };

    javaGenerator.forBlock['ez_expr_attribute_get'] = function(block) {
        let target = javaGenerator.valueToCode(block, 'TARGET', javaGenerator.ORDER_ATOMIC);
        const attr = block.getFieldValue('ATTRIBUTE');
        
        if (!target) target = getSmartMe(block);

        // Return 0 if entity is invalid or attribute is null (Safety first)
        // Ternary hell: (target is LivingEntity) ? ( (attr != null) ? attr.getValue() : 0 ) : 0
        
        const code = `(${target} instanceof LivingEntity && ((LivingEntity)${target}).getAttribute(Attribute.${attr}) != null ? ((LivingEntity)${target}).getAttribute(Attribute.${attr}).getValue() : 0)`;
        return [code, javaGenerator.ORDER_ATOMIC];
    };

    // --- DATA ---
    javaGenerator.forBlock['text_string'] = function(block) {
        const text = block.getFieldValue('TEXT');
        return [`"${text}"`, javaGenerator.ORDER_ATOMIC];
    };
    
    javaGenerator.forBlock['math_number_simple'] = function(block) {
        const num = block.getFieldValue('NUM');
        return [num, javaGenerator.ORDER_ATOMIC];
    };

    return javaGenerator;
};
