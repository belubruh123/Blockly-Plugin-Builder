// Block Definitions for Paper MC

export const defineBlocks = () => {
    
    // --- EVENTS (Legacy, replaced by dynamic ones mostly) ---
    Blockly.common.defineBlocks({
        'paper_event': {
            init: function() {
                this.appendDummyInput()
                    .appendField("When")
                    .appendField(new Blockly.FieldDropdown([
                        ["Player Joins", "PlayerJoinEvent"],
                        ["Player Breaks Block", "BlockBreakEvent"],
                        ["Player Quits", "PlayerQuitEvent"],
                        ["Server Loads", "ServerLoad"]
                    ]), "EVENT_TYPE");
                this.appendStatementInput("DO")
                    .setCheck(null)
                    .appendField("do");
                this.setColour(230);
                this.setTooltip("Triggers code when a Minecraft event happens.");
            }
        }
    });

    // --- COMMANDS ---
    Blockly.common.defineBlocks({
        'paper_command': {
            init: function() {
                this.appendDummyInput()
                    .appendField("Define Command /")
                    .appendField(new Blockly.FieldTextInput("mycommand"), "CMD_NAME");
                this.appendStatementInput("DO")
                    .setCheck(null)
                    .appendField("execute");
                this.setColour(120); // Green
                this.setTooltip("Creates a new command.");
            }
        }
    });

    // Command Args
    Blockly.common.defineBlocks({
        'paper_command_arg_get': {
            init: function() {
                this.appendValueInput("INDEX")
                    .setCheck("Number")
                    .appendField("Get Command Argument (Index)");
                this.setOutput(true, "String");
                this.setColour(120);
                this.setTooltip("Gets a specific word typed after the command. Index 0 is the first word.");
            }
        }
    });

    Blockly.common.defineBlocks({
        'paper_command_args_length': {
            init: function() {
                this.appendDummyInput()
                    .appendField("Command Arguments Count");
                this.setOutput(true, "Number");
                this.setColour(120);
                this.setTooltip("How many words were typed after the command.");
            }
        }
    });

    // --- VARIABLES (Typed) ---
    const VAR_TYPES = [
        ["String", "String"],
        ["Number (int)", "int"],
        ["Decimal (double)", "double"],
        ["Boolean", "boolean"],
        ["Player", "Player"],
        ["Entity", "Entity"],
        ["Location", "Location"],
        ["ItemStack", "ItemStack"],
        ["List", "List"]
    ];

    Blockly.common.defineBlocks({
        'var_declare_typed': {
            init: function() {
                this.appendValueInput("VALUE")
                    .appendField("Create Variable")
                    .appendField(new Blockly.FieldDropdown(VAR_TYPES), "TYPE")
                    .appendField(new Blockly.FieldTextInput("myVar"), "VAR_NAME")
                    .appendField("=");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(330);
                this.setTooltip("Creates a new variable with a specific type.");
            }
        }
    });

    Blockly.common.defineBlocks({
        'var_get_typed': {
            init: function() {
                this.appendDummyInput()
                    .appendField("Get Variable")
                    .appendField(new Blockly.FieldTextInput("myVar"), "VAR_NAME");
                this.setOutput(true, null); // Returns any
                this.setColour(330);
                this.setTooltip("Gets the value of a variable.");
            }
        }
    });

    Blockly.common.defineBlocks({
        'var_set_typed': {
            init: function() {
                this.appendValueInput("VALUE")
                    .appendField("Set Variable")
                    .appendField(new Blockly.FieldTextInput("myVar"), "VAR_NAME")
                    .appendField("to");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(330);
                this.setTooltip("Changes the value of an existing variable.");
            }
        }
    });

    // --- ACTIONS (Legacy/Helpers) ---
    
    Blockly.common.defineBlocks({
        'paper_action_send_message': {
            init: function() {
                this.appendValueInput("MESSAGE")
                    .setCheck("String")
                    .appendField("Send Message");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip("Sends a chat message to the player.");
            }
        }
    });

    Blockly.common.defineBlocks({
        'paper_action_give_item': {
            init: function() {
                this.appendDummyInput()
                    .appendField("Give Item")
                    .appendField(new Blockly.FieldDropdown([
                        ["Diamond", "DIAMOND"],
                        ["Dirt", "DIRT"],
                        ["Stone", "STONE"],
                        ["Iron Ingot", "IRON_INGOT"]
                    ]), "MATERIAL");
                this.appendValueInput("AMOUNT")
                    .setCheck("Number")
                    .appendField("Amount");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip("Gives an item to the player.");
            }
        }
    });

    Blockly.common.defineBlocks({
        'paper_action_teleport_spawn': {
            init: function() {
                this.appendDummyInput()
                    .appendField("Teleport to World Spawn");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
            }
        }
    });
    
    // --- DATA ---
    Blockly.common.defineBlocks({
        'text_string': {
            init: function() {
                this.appendDummyInput()
                    .appendField("\"")
                    .appendField(new Blockly.FieldTextInput("Hello World"), "TEXT")
                    .appendField("\"");
                this.setOutput(true, "String");
                this.setColour(0);
            }
        }
    });
    
    Blockly.common.defineBlocks({
        'math_number_simple': {
            init: function() {
                this.appendDummyInput()
                    .appendField(new Blockly.FieldNumber(1), "NUM");
                this.setOutput(true, "Number");
                this.setColour(230);
            }
        }
    });

    // --- EASY MODE: CORE ACTIONS ---

    // 1. SMART TELEPORT
    Blockly.common.defineBlocks({
        'ez_action_teleport': {
            init: function() {
                this.appendValueInput("TARGET")
                    .setCheck(["Player", "Entity", "LivingEntity"])
                    .appendField("Teleport");
                this.appendValueInput("DESTINATION")
                    .setCheck(["Location", "Entity", "Player"]) // Can tp to a loc or a person
                    .appendField("to");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip("Move a player or entity instantly to a new place.");
            }
        }
    });

    // 2. SMART MESSAGE
    Blockly.common.defineBlocks({
        'ez_action_message': {
            init: function() {
                this.appendValueInput("TARGET")
                    .setCheck(["Player", "CommandSender"])
                    .appendField("Message");
                this.appendValueInput("MSG")
                    .setCheck(null) // Allow text, numbers, whatever
                    .appendField("text");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip("Send a chat message.");
            }
        }
    });

    // 3. SMART GIVE
    Blockly.common.defineBlocks({
        'ez_action_give': {
            init: function() {
                this.appendValueInput("TARGET")
                    .setCheck(["Player", "Inventory"])
                    .appendField("Give");
                this.appendValueInput("AMOUNT")
                    .setCheck("Number")
                    .appendField("amount");
                this.appendDummyInput()
                    .appendField("of")
                    .appendField(new Blockly.FieldDropdown([
                        ["Diamond", "DIAMOND"],
                        ["Dirt", "DIRT"],
                        ["Stone", "STONE"],
                        ["Iron Ingot", "IRON_INGOT"],
                        ["Gold Ingot", "GOLD_INGOT"],
                        ["Apple", "APPLE"],
                        ["Sword (Diamond)", "DIAMOND_SWORD"]
                    ]), "ITEM");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip("Give items to a player.");
            }
        }
    });

    // 4. BROADCAST
    Blockly.common.defineBlocks({
        'ez_action_broadcast': {
            init: function() {
                this.appendValueInput("MSG")
                    .setCheck(null)
                    .appendField("Broadcast");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip("Sends a message to everyone on the server.");
            }
        }
    });

    // 5. CONSOLE LOG
    Blockly.common.defineBlocks({
        'ez_action_log': {
            init: function() {
                this.appendValueInput("MSG")
                    .setCheck(null)
                    .appendField("Log to Console");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160); // Grayish or Action color? Keep action color.
                this.setTooltip("Writes text to the server console.");
            }
        }
    });

    // --- EASY MODE: DATA ---

    // 4. "ME" (Smart Context)
    Blockly.common.defineBlocks({
        'ez_val_me': {
            init: function() {
                this.appendDummyInput()
                    .appendField("Me / Triggering Player");
                this.setOutput(true, ["Player", "Entity", "CommandSender"]);
                this.setColour(290);
                this.setTooltip("The player who ran the command or triggered the event.");
            }
        }
    });

    // 5. Location of Entity
    Blockly.common.defineBlocks({
        'ez_val_location_of': {
            init: function() {
                this.appendValueInput("ENTITY")
                    .setCheck("Entity")
                    .appendField("Location of");
                this.setOutput(true, "Location");
                this.setColour(290);
            }
        }
    });

    // 6. XYZ Coords
    Blockly.common.defineBlocks({
        'ez_val_coords': {
            init: function() {
                this.appendValueInput("X").setCheck("Number").appendField("Pos X:");
                this.appendValueInput("Y").setCheck("Number").appendField("Y:");
                this.appendValueInput("Z").setCheck("Number").appendField("Z:");
                this.setOutput(true, "Location");
                this.setColour(290);
                this.setInputsInline(true);
            }
        }
    });

    // --- TYPE CHECKING ---
    const CHECKABLE_TYPES = [
        ["Player", "Player"],
        ["Zombie", "Zombie"],
        ["Skeleton", "Skeleton"],
        ["Creeper", "Creeper"],
        ["Living Entity", "LivingEntity"],
        ["Arrow", "Arrow"],
        ["Snowball", "Snowball"],
        ["Dropped Item", "Item"]
    ];

    Blockly.common.defineBlocks({
        'logic_is_type': {
            init: function() {
                this.appendValueInput("OBJECT")
                    .appendField("Is");
                this.appendDummyInput()
                    .appendField("a")
                    .appendField(new Blockly.FieldDropdown(CHECKABLE_TYPES), "TYPE")
                    .appendField("?");
                this.setOutput(true, "boolean");
                this.setColour(210); // Logic color
                this.setTooltip("Checks if the object is a specific type (e.g., Is this entity a Player?).");
            }
        }
    });

    // --- ATTRIBUTES ---
    const ATTRIBUTES = [
        ["Max Health", "GENERIC_MAX_HEALTH"],
        ["Movement Speed", "GENERIC_MOVEMENT_SPEED"],
        ["Attack Damage", "GENERIC_ATTACK_DAMAGE"],
        ["Armor", "GENERIC_ARMOR"],
        ["Armor Toughness", "GENERIC_ARMOR_TOUGHNESS"],
        ["Knockback Resistance", "GENERIC_KNOCKBACK_RESISTANCE"],
        ["Luck", "GENERIC_LUCK"],
        ["Scale", "GENERIC_SCALE"],
        ["Step Height", "GENERIC_STEP_HEIGHT"]
    ];

    Blockly.common.defineBlocks({
        'paper_action_set_attribute': {
            init: function() {
                this.appendValueInput("TARGET")
                    .setCheck(["Player", "LivingEntity", "Entity"]) // Allow Entity, check later
                    .appendField("Set Attribute");
                this.appendDummyInput()
                    .appendField(new Blockly.FieldDropdown(ATTRIBUTES), "ATTRIBUTE");
                this.appendValueInput("VALUE")
                    .setCheck("Number")
                    .appendField("Base Value to");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip("Sets a permanent attribute value (e.g., Speed 0.2, Health 20).");
            }
        }
    });

    Blockly.common.defineBlocks({
        'ez_action_attribute_change': {
            init: function() {
                this.appendValueInput("TARGET")
                    .setCheck(["Player", "LivingEntity", "Entity"])
                    .appendField("Change Attribute");
                this.appendDummyInput()
                    .appendField(new Blockly.FieldDropdown(ATTRIBUTES), "ATTRIBUTE");
                this.appendValueInput("AMOUNT")
                    .setCheck("Number")
                    .appendField("by");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip("Increases or decreases an attribute value (e.g., add 2 to Max Health).");
            }
        }
    });

    Blockly.common.defineBlocks({
        'ez_expr_attribute_get': {
            init: function() {
                this.appendValueInput("TARGET")
                    .setCheck(["Player", "LivingEntity", "Entity"])
                    .appendField("Get Value of");
                this.appendDummyInput()
                    .appendField(new Blockly.FieldDropdown(ATTRIBUTES), "ATTRIBUTE");
                this.appendDummyInput()
                    .appendField("from");
                this.setOutput(true, "Number");
                this.setColour(290);
                this.setTooltip("Gets the current effective value of an attribute.");
            }
        }
    });

    // --- EASY MODE: FUN & WORLD ---

    // 7. REPLACE BLOCK
    Blockly.common.defineBlocks({
        'ez_action_replace_block': {
            init: function() {
                this.appendValueInput("LOCATION")
                    .setCheck(["Location", "Entity"]) // Smart detect
                    .appendField("Set Block at");
                this.appendDummyInput()
                    .appendField("to")
                    .appendField(new Blockly.FieldDropdown([
                        ["Air (Remove)", "AIR"],
                        ["Stone", "STONE"],
                        ["Dirt", "DIRT"],
                        ["Grass Block", "GRASS_BLOCK"],
                        ["Diamond Block", "DIAMOND_BLOCK"],
                        ["Gold Block", "GOLD_BLOCK"],
                        ["Iron Block", "IRON_BLOCK"],
                        ["Bedrock", "BEDROCK"],
                        ["Water", "WATER"],
                        ["Lava", "LAVA"],
                        ["Fire", "FIRE"],
                        ["TNT", "TNT"],
                        ["Web", "COBWEB"]
                    ]), "MATERIAL");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip("Changes a block at a specific location.");
            }
        }
    });

    // 8. SPAWN LIGHTNING
    Blockly.common.defineBlocks({
        'ez_action_spawn_lightning': {
            init: function() {
                this.appendValueInput("LOCATION")
                    .setCheck(["Location", "Entity"]) // Smart: if entity, strikes the entity
                    .appendField("Strike Lightning at");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip("Summons a lightning bolt.");
            }
        }
    });

    // 9. EXPLOSION
    Blockly.common.defineBlocks({
        'ez_action_explosion': {
            init: function() {
                this.appendValueInput("LOCATION")
                    .setCheck(["Location", "Entity"])
                    .appendField("Create Explosion at");
                this.appendValueInput("POWER")
                    .setCheck("Number")
                    .appendField("Power");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip("Creates an explosion. Power 4 is like TNT.");
            }
        }
    });

    // 10. SHOW TITLE (Splash Text)
    Blockly.common.defineBlocks({
        'ez_action_title': {
            init: function() {
                this.appendValueInput("TARGET")
                    .setCheck(["Player", "CommandSender"])
                    .appendField("Show Title to");
                this.appendValueInput("TITLE")
                    .setCheck(null)
                    .appendField("Main Text");
                this.appendValueInput("SUBTITLE")
                    .setCheck(null)
                    .appendField("Subtitle");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip("Shows a large text on the player's screen.");
            }
        }
    });

    // 11. PLAYER ABILITIES (Fly, Heal)
    Blockly.common.defineBlocks({
        'ez_action_set_health': {
            init: function() {
                this.appendValueInput("TARGET")
                    .setCheck(["Player", "LivingEntity"])
                    .appendField("Set Health of");
                this.appendValueInput("HEALTH")
                    .setCheck("Number")
                    .appendField("to");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip("Sets the current health (20 = Full Hearts).");
            }
        }
    });

    Blockly.common.defineBlocks({
        'ez_action_toggle_flight': {
            init: function() {
                this.appendValueInput("TARGET")
                    .setCheck("Player")
                    .appendField("Set Flight for");
                this.appendDummyInput()
                    .appendField(new Blockly.FieldDropdown([
                        ["Allow Flying", "TRUE"],
                        ["Disable Flying", "FALSE"]
                    ]), "STATE");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip("Allows or disallows a player to fly.");
            }
        }
    });

    // --- LOOPS (Extended) ---
    Blockly.common.defineBlocks({
        'controls_for_simple': {
            init: function() {
                this.appendDummyInput()
                    .appendField("Count with")
                    .appendField(new Blockly.FieldTextInput("i"), "VAR")
                    .appendField("from");
                this.appendValueInput("FROM")
                    .setCheck("Number");
                this.appendDummyInput()
                    .appendField("to");
                this.appendValueInput("TO")
                    .setCheck("Number");
                this.appendDummyInput()
                    .appendField("by 1");
                this.appendStatementInput("DO")
                    .appendField("do");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(120);
                this.setTooltip("Counts from a number to another number.");
            }
        }
    });

    // --- LISTS ---
    Blockly.common.defineBlocks({
        'lists_create_new': {
            init: function() {
                this.appendDummyInput()
                    .appendField("Create New Empty List");
                this.setOutput(true, "List");
                this.setColour(260); // List color
                this.setTooltip("Creates a new empty list (ArrayList).");
            }
        }
    });

    Blockly.common.defineBlocks({
        'lists_add': {
            init: function() {
                this.appendValueInput("LIST")
                    .setCheck("List")
                    .appendField("in list");
                this.appendValueInput("ITEM")
                    .appendField("add item");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(260);
                this.setTooltip("Adds an item to the end of the list.");
            }
        }
    });

    Blockly.common.defineBlocks({
        'lists_get_index': {
            init: function() {
                this.appendValueInput("LIST")
                    .setCheck("List")
                    .appendField("in list");
                this.appendValueInput("INDEX")
                    .setCheck("Number")
                    .appendField("get item at index");
                this.setOutput(true, null);
                this.setColour(260);
                this.setTooltip("Gets an item (Index starts at 0).");
            }
        }
    });
    
    Blockly.common.defineBlocks({
        'lists_size': {
            init: function() {
                this.appendValueInput("LIST")
                    .setCheck("List")
                    .appendField("length of list");
                this.setOutput(true, "Number");
                this.setColour(260);
            }
        }
    });
};
