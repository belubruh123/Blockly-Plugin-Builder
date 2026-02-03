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

    // Events
    javaGenerator.forBlock['paper_event'] = function(block) {
        const eventType = block.getFieldValue('EVENT_TYPE');
        const statements = javaGenerator.statementToCode(block, 'DO');
        return `
    @EventHandler
    public void on${eventType}(${eventType} event) {
${statements}
    }
`;
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
