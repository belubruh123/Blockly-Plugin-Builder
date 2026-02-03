import { API_DATA } from './api_data.js';

export const loadDynamicBlocks = (blockly, generator) => {
    const { types, enums, events, methods, context_getters } = API_DATA;

    // Helper: Get color by type
    const getColor = (type) => (types[type] ? types[type].color : 230);

    // 1. GENERATE ENUM BLOCKS (Dropdowns)
    Object.keys(enums).forEach(enumName => {
        const blockType = `paper_enum_${enumName.toLowerCase()}`;
        
        blockly.common.defineBlocks({
            [blockType]: {
                init: function() {
                    const options = enums[enumName].map(e => [e, e]);
                    this.appendDummyInput()
                        .appendField(enumName)
                        .appendField(new blockly.FieldDropdown(options), "VAL");
                    this.setOutput(true, enumName);
                    this.setColour(getColor(enumName));
                }
            }
        });

        generator.forBlock[blockType] = function(block) {
            return [`${enumName}.${block.getFieldValue('VAL')}`, generator.ORDER_ATOMIC];
        };
    });

    // 2. GENERATE METHOD BLOCKS
    methods.forEach(m => {
        const cleanName = m.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const blockType = `paper_method_${cleanName}`;
        const isAction = m.type === "void"; // Statement vs Expression

        blockly.common.defineBlocks({
            [blockType]: {
                init: function() {
                    // Title
                    const input = this.appendDummyInput().appendField(m.name);
                    
                    // Target (Object calling the method)
                    if (m.target) {
                        this.appendValueInput("TARGET")
                            .setCheck(m.target)
                            .appendField(`(${m.target})`);
                    }

                    // Arguments
                    m.args.forEach(arg => {
                        this.appendValueInput("ARG_" + arg.name)
                            .setCheck(arg.type)
                            .appendField(arg.name);
                    });

                    // Inputs/Outputs
                    if (isAction) {
                        this.setPreviousStatement(true, null);
                        this.setNextStatement(true, null);
                    } else {
                        this.setOutput(true, m.type);
                    }

                    this.setColour(getColor(m.type === "void" ? m.target : m.type));
                    this.setTooltip(m.desc || `Java: ${m.method}(...)`);
                }
            }
        });

        generator.forBlock[blockType] = function(block) {
            // Get Target
            let targetCode = "";
            if (m.target) {
                targetCode = generator.valueToCode(block, 'TARGET', generator.ORDER_ATOMIC);
                
                // --- SMART DEFAULTS ---
                if (!targetCode) {
                    // Try to guess based on root block
                    let root = block.getRootBlock();
                    if (root && root.type) {
                        if (root.type.startsWith('paper_event_')) {
                            // Most events use event.getPlayer() or event.getEntity()
                            if (m.target === "Player") targetCode = "event.getPlayer()";
                            else if (m.target === "Entity" || m.target === "LivingEntity") targetCode = "event.getEntity()";
                        } else if (root.type === 'paper_command') {
                            if (m.target === "Player") targetCode = "((Player) sender)";
                            else targetCode = "sender";
                        }
                    }
                    
                    if (!targetCode) targetCode = "/* Missing " + m.target + " */";
                }
            }

            // Get Args
            const argsCode = m.args.map(arg => {
                let code = generator.valueToCode(block, 'ARG_' + arg.name, generator.ORDER_NONE);
                if (!code && arg.default) code = arg.default;
                return code || "null"; 
            }).join(", ");

            // Construct Code
            if (m.method.startsWith("new ")) {
                return [`new ${m.type}(${argsCode})`, generator.ORDER_ATOMIC];
            } else if (m.method.includes(".")) {
                // Static: Bukkit.broadcast(...) or Bukkit.getPlayer(...)
                const fullCode = `${m.method}(${argsCode})`;
                if (isAction) return fullCode + ";\n";
                return [fullCode, generator.ORDER_ATOMIC];
            } else {
                // Instance method: target.method(...)
                const fullCode = `${targetCode}.${m.method}(${argsCode})`;
                if (isAction) {
                    return fullCode + ";\n";
                }
                else {
                    return [fullCode, generator.ORDER_ATOMIC];
                }
            }
        };
    });

    // 3. GENERATE EVENT BLOCKS
    // These replace the generic "paper_event" from V1 for more specific control if needed, 
    // but the generic one was good. We'll add a "Specific Event" block that populates the context.
    // Actually, V1's event block used a dropdown. We'll stick to that but expanded.
    // We will update the V1 event block definition in blocks_def.js separately or overwrite it here.
    // Let's create specific Event Wrapper blocks for better UX (e.g. "On Join" block).
    
    events.forEach(evt => {
        const blockType = `paper_event_${evt.id.toLowerCase()}`;
        blockly.common.defineBlocks({
            [blockType]: {
                init: function() {
                    this.appendDummyInput()
                        .appendField(`On ${evt.id}`);
                    this.appendStatementInput("DO")
                        .appendField("do");
                    this.setColour(230);
                    this.setTooltip("Event: " + evt.id);
                }
            }
        });

        generator.forBlock[blockType] = function(block) {
            const statements = generator.statementToCode(block, 'DO');
            return `    @EventHandler
    public void on${evt.id}(${evt.id} event) {
${statements}
    }
`;
        };
    });

    // 4. CONTEXT GETTERS
    context_getters.forEach(ctx => {
        const blockType = `paper_ctx_${ctx.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        blockly.common.defineBlocks({
            [blockType]: {
                init: function() {
                    this.appendDummyInput().appendField(ctx.name);
                    this.setOutput(true, ctx.type);
                    this.setColour(getColor(ctx.type));
                    this.setTooltip(ctx.desc || "Context variable");
                }
            }
        });

        generator.forBlock[blockType] = function(block) {
            return [ctx.code, generator.ORDER_ATOMIC];
        };
    });

    // 5. SIMPLE LOGIC & MATH (Wrappers for Java) 
    
    // Logic: If
    blockly.common.defineBlocks({
        'java_if': {
            init: function() {
                this.appendValueInput("IF")
                    .setCheck("boolean")
                    .appendField("if");
                this.appendStatementInput("DO")
                    .appendField("then");
                this.appendStatementInput("ELSE")
                    .appendField("else");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(210);
            }
        }
    });
    generator.forBlock['java_if'] = function(block) {
        const condition = generator.valueToCode(block, 'IF', generator.ORDER_NONE) || 'false';
        const branch = generator.statementToCode(block, 'DO');
        const elseBranch = generator.statementToCode(block, 'ELSE');
        let code = `if (${condition}) {\n${branch}}`;
        if (elseBranch) code += ` else {\n${elseBranch}}`;
        return code + '\n';
    };

    // Math: Ops
    blockly.common.defineBlocks({
        'java_math_op': {
            init: function() {
                this.appendValueInput("A").setCheck("Number");
                this.appendDummyInput().appendField(new blockly.FieldDropdown([["+", "+"], ["-", "-"], ["*", "*"], ["/", "/"]]), "OP");
                this.appendValueInput("B").setCheck("Number");
                this.setOutput(true, "Number");
                this.setColour(230);
            }
        }
    });
    generator.forBlock['java_math_op'] = function(block) {
        const a = generator.valueToCode(block, 'A', generator.ORDER_ATOMIC) || '0';
        const b = generator.valueToCode(block, 'B', generator.ORDER_ATOMIC) || '0';
        const op = block.getFieldValue('OP');
        return [`${a} ${op} ${b}`, generator.ORDER_ATOMIC];
    };
    
    // Logic: Compare
    blockly.common.defineBlocks({
        'java_logic_compare': {
            init: function() {
                this.appendValueInput("A");
                this.appendDummyInput().appendField(new blockly.FieldDropdown([["=", "=="], ["!=", "!="], [">", ">"], ["<", "<"]]), "OP");
                this.appendValueInput("B");
                this.setOutput(true, "boolean");
                this.setColour(210);
            }
        }
    });
    generator.forBlock['java_logic_compare'] = function(block) {
        const a = generator.valueToCode(block, 'A', generator.ORDER_ATOMIC) || 'null';
        const b = generator.valueToCode(block, 'B', generator.ORDER_ATOMIC) || 'null';
        const op = block.getFieldValue('OP');
        
        // Java String comparison edge case
        // We'll just generate `==` for now, assuming primitives or primitive wrappers. 
        // A robust IDE would check types and use .equals() for Objects.
        return [`${a} ${op} ${b}`, generator.ORDER_ATOMIC];
    };
};