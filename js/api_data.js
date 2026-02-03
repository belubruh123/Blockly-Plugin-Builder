// Massive Paper API 1.21 Definition

export const API_DATA = {
    // --- TYPES & COLORS ---
    types: {
        "void": { color: 0 },
        "String": { color: 160 },
        "int": { color: 230 },
        "double": { color: 230 },
        "boolean": { color: 210 },
        "Player": { color: 120 },
        "Entity": { color: 120 },
        "LivingEntity": { color: 120 },
        "Location": { color: 290 },
        "World": { color: 290 },
        "ItemStack": { color: 30 },
        "Material": { color: 30 },
        "Block": { color: 60 },
        "Component": { color: 160 }, // Adventure Component
        "Inventory": { color: 30 },
        "Sound": { color: 260 }
    },

    // --- ENUMS (Simplifying huge lists) ---
    enums: {
        "Material": [
            "DIAMOND", "DIRT", "STONE", "GRASS_BLOCK", "OAK_LOG", "OAK_PLANKS", "IRON_INGOT", "GOLD_INGOT", 
            "NETHERITE_INGOT", "APPLE", "GOLDEN_APPLE", "DIAMOND_SWORD", "IRON_SWORD", "BOW", "ARROW",
            "DIAMOND_HELMET", "DIAMOND_CHESTPLATE", "DIAMOND_LEGGINGS", "DIAMOND_BOOTS",
            "WATER_BUCKET", "LAVA_BUCKET", "TNT", "OBSIDIAN", "BEDROCK"
        ],
        "Sound": [
            "ENTITY_PLAYER_LEVELUP", "ENTITY_EXPERIENCE_ORB_PICKUP", "BLOCK_ANVIL_LAND", "ENTITY_ZOMBIE_GROAN",
            "ENTITY_SKELETON_SHOOT", "ENTITY_VILLAGER_NO", "ENTITY_VILLAGER_YES", "UI_BUTTON_CLICK"
        ],
        "EntityType": [
            "ZOMBIE", "SKELETON", "CREEPER", "SPIDER", "ENDERMAN", "COW", "SHEEP", "PIG", "CHICKEN",
            "VILLAGER", "IRON_GOLEM", "WITHER", "ENDER_DRAGON"
        ],
        "GameMode": [
            "SURVIVAL", "CREATIVE", "ADVENTURE", "SPECTATOR"
        ],
        "PotionEffectType": [
            "SPEED", "SLOW", "FAST_DIGGING", "SLOW_DIGGING", "INCREASE_DAMAGE", "HEAL", "HARM",
            "JUMP", "CONFUSION", "REGENERATION", "DAMAGE_RESISTANCE", "FIRE_RESISTANCE", "WATER_BREATHING",
            "INVISIBILITY", "BLINDNESS", "NIGHT_VISION", "HUNGER", "WEAKNESS", "POISON", "WITHER"
        ]
    },

    // --- EVENTS ---
    events: [
        { id: "PlayerJoinEvent", category: "Player Events", var: "event" },
        { id: "PlayerQuitEvent", category: "Player Events", var: "event" },
        { id: "PlayerMoveEvent", category: "Player Events", var: "event" },
        { id: "PlayerToggleSneakEvent", category: "Player Events", var: "event" },
        { id: "PlayerToggleSprintEvent", category: "Player Events", var: "event" },
        { id: "PlayerDeathEvent", category: "Player Events", var: "event" },
        { id: "PlayerRespawnEvent", category: "Player Events", var: "event" },
        { id: "AsyncChatEvent", category: "Player Events", var: "event", import: "io.papermc.paper.event.player.AsyncChatEvent" },
        
        { id: "BlockBreakEvent", category: "Block Events", var: "event" },
        { id: "BlockPlaceEvent", category: "Block Events", var: "event" },
        
        { id: "EntityDamageEvent", category: "Entity Events", var: "event" },
        { id: "EntityDamageByEntityEvent", category: "Entity Events", var: "event" },
        { id: "EntityDeathEvent", category: "Entity Events", var: "event" },
        { id: "EntitySpawnEvent", category: "Entity Events", var: "event" }
    ],

    // --- METHODS (The Core Logic) ---
    // Format: 
    // { name: "Display Name", type: "return_type", target: "target_type", method: "javaMethod", args: [ {name, type}, ... ], desc: "Description" }
    // If target is null, it's a static/utility method or constructor.
    
    methods: [
        // --- PLAYER ACTIONS ---
        { name: "Send Message", type: "void", target: "Player", method: "sendMessage", args: [{name: "message", type: "Component"}], desc: "Sends a text message to the player's chat." },
        { name: "Send Action Bar", type: "void", target: "Player", method: "sendActionBar", args: [{name: "message", type: "Component"}], desc: "Displays a temporary message just above the player's hotbar." },
        { name: "Teleport", type: "boolean", target: "Entity", method: "teleport", args: [{name: "location", type: "Location"}], desc: "Instantly moves the entity/player to a new location." },
        { name: "Set Health", type: "void", target: "LivingEntity", method: "setHealth", args: [{name: "health", type: "double"}], desc: "Sets how many hearts (HP) the entity has. (20 = Full Hearts)" },
        { name: "Get Health", type: "double", target: "LivingEntity", method: "getHealth", args: [], desc: "Returns the number of hearts the entity currently has." },
        { name: "Set Food Level", type: "void", target: "Player", method: "setFoodLevel", args: [{name: "food", type: "int"}], desc: "Sets the hunger bar level. (20 = Full)" },
        { name: "Get Food Level", type: "int", target: "Player", method: "getFoodLevel", args: [], desc: "Gets the current hunger bar level." },
        { name: "Set GameMode", type: "void", target: "Player", method: "setGameMode", args: [{name: "mode", type: "GameMode"}], desc: "Changes the player's gamemode (Survival, Creative, etc.)." },
        { name: "Get Name", type: "String", target: "Player", method: "getName", args: [], desc: "Gets the player's username." },
        { name: "Get Display Name", type: "Component", target: "Player", method: "displayName", args: [], desc: "Gets the player's colorful nickname if they have one." },
        { name: "Get Location", type: "Location", target: "Entity", method: "getLocation", args: [], desc: "Finds out where the entity is right now (X, Y, Z)." },
        { name: "Get World", type: "World", target: "Entity", method: "getWorld", args: [], desc: "Gets the world the entity is currently in." },
        { name: "Play Sound", type: "void", target: "Player", method: "playSound", args: [{name: "loc", type: "Location"}, {name: "sound", type: "Sound"}, {name: "vol", type: "float", default: 1.0}, {name: "pitch", type: "float", default: 1.0}], desc: "Plays a sound effect for the player." },
        { name: "Kick Player", type: "void", target: "Player", method: "kick", args: [{name: "reason", type: "Component"}], desc: "Disconnects the player from the server with a message." },
        { name: "Set Op", type: "void", target: "Player", method: "setOp", args: [{name: "value", type: "boolean"}], desc: "Gives or removes Operator (Admin) status." },
        { name: "Is Op?", type: "boolean", target: "Player", method: "isOp", args: [], desc: "Checks if the player is an Admin/Operator." },

        // --- INVENTORY ---
        { name: "Get Inventory", type: "Inventory", target: "Player", method: "getInventory", args: [], desc: "Opens the player's backpack/inventory." },
        { name: "Add Item", type: "void", target: "Inventory", method: "addItem", args: [{name: "item", type: "ItemStack"}], desc: "Puts an item into the inventory." },
        { name: "Clear Inventory", type: "void", target: "Inventory", method: "clear", args: [], desc: "Removes ALL items from the inventory." },
        { name: "Contains Item", type: "boolean", target: "Inventory", method: "contains", args: [{name: "material", type: "Material"}], desc: "Checks if the inventory has a specific type of item." },
        
        // --- WORLD ---
        { name: "Set Time", type: "void", target: "World", method: "setTime", args: [{name: "time", type: "long"}], desc: "Sets the world time (0 = Sunrise, 13000 = Night)." },
        { name: "Get Time", type: "long", target: "World", method: "getTime", args: [], desc: "Gets the current time of the world." },
        { name: "Set Storm", type: "void", target: "World", method: "setStorm", args: [{name: "storming", type: "boolean"}], desc: "Turns the rain/storm on or off." },
        { name: "Spawn Entity", type: "Entity", target: "World", method: "spawnEntity", args: [{name: "loc", type: "Location"}, {name: "type", type: "EntityType"}], desc: "Summons a new creature (Zombie, Pig, etc.) at a location." },
        { name: "Get Block At", type: "Block", target: "World", method: "getBlockAt", args: [{name: "loc", type: "Location"}], desc: "Gets the block information at a specific coordinate." },
        { name: "Get Spawn Location", type: "Location", target: "World", method: "getSpawnLocation", args: [], desc: "Gets the default spawn point of the world." },

        // --- BLOCK ---
        { name: "Get Block Type", type: "Material", target: "Block", method: "getType", args: [], desc: "Gets what kind of block this is (Dirt, Stone, etc.)." },
        { name: "Set Block Type", type: "void", target: "Block", method: "setType", args: [{name: "material", type: "Material"}], desc: "Changes the block to a different material." },
        
        // --- CONSTRUCTORS / UTILS ---
        { name: "Create Component (Text)", type: "Component", target: null, method: "Component.text", args: [{name: "text", type: "String"}], desc: "Creates a text object for chat messages." },
        { name: "Create ItemStack", type: "ItemStack", target: null, method: "new ItemStack", args: [{name: "type", type: "Material"}, {name: "amount", type: "int"}], desc: "Creates a stack of items (e.g., 64 Diamonds)." },
        { name: "Create Location", type: "Location", target: null, method: "new Location", args: [{name: "world", type: "World"}, {name: "x", type: "double"}, {name: "y", type: "double"}, {name: "z", type: "double"}], desc: "Creates a specific coordinate in a world." },
        
        // --- GLOBAL ACTIONS ---
        { name: "Get Player by Name", type: "Player", target: null, method: "Bukkit.getPlayer", args: [{name: "name", type: "String"}], desc: "Finds a player who is currently online using their name." },
        { name: "Broadcast Message", type: "void", target: null, method: "Bukkit.broadcast", args: [{name: "message", type: "Component"}], desc: "Sends a message to EVERYONE on the server." },

        // --- EVENT CONTROL ---
        { name: "Cancel Event", type: "void", target: null, method: "event.setCancelled", args: [{name: "cancel", type: "boolean", default: "true"}], desc: "Stops the event from happening (e.g., prevent block break)." }
    ],

    // --- CONTEXT VARIABLES (Getters for 'event.getPlayer()' etc) ---
    // These are blocks that return valid objects based on the context (Event or Command)
    context_getters: [
        { name: "Event Player", type: "Player", code: "event.getPlayer()", contexts: ["PlayerJoinEvent", "PlayerQuitEvent", "BlockBreakEvent", "PlayerMoveEvent", "AsyncChatEvent", "PlayerDeathEvent"], desc: "The player who triggered this event." },
        { name: "Event Block", type: "Block", code: "event.getBlock()", contexts: ["BlockBreakEvent", "BlockPlaceEvent"], desc: "The block that was broken or placed." },
        { name: "Event Entity", type: "Entity", code: "event.getEntity()", contexts: ["EntityDamageEvent", "EntityDeathEvent", "EntityDamageByEntityEvent", "EntitySpawnEvent"], desc: "The entity involved in this event (Victim in damage events)." },
        { name: "Event Damager", type: "Entity", code: "((org.bukkit.event.entity.EntityDamageByEntityEvent) event).getDamager()", contexts: ["EntityDamageByEntityEvent"], desc: "The entity that caused the damage (Attacker)." },
        { name: "Event Killer", type: "Player", code: "event.getEntity().getKiller()", contexts: ["EntityDeathEvent", "PlayerDeathEvent"], desc: "The player who killed this entity (if applicable)." },
        { name: "Event From-Location", type: "Location", code: "event.getFrom()", contexts: ["PlayerMoveEvent"], desc: "Where the player moved FROM." },
        { name: "Event To-Location", type: "Location", code: "event.getTo()", contexts: ["PlayerMoveEvent"], desc: "Where the player moved TO." },
        { name: "Event Message", type: "Component", code: "event.message()", contexts: ["AsyncChatEvent"], desc: "The message the player sent." },
        { name: "Command Sender", type: "CommandSender", code: "sender", contexts: ["Command"], desc: "The person or console that ran the command." },
        { name: "Command Sender (As Player)", type: "Player", code: "((Player) sender)", contexts: ["Command"], desc: "The player who ran the command (assumes it wasn't the console)." } // Unsafe cast warning usually needed
    ]
};
