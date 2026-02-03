// Dynamic Documentation Renderer

import { defineBlocks } from './blocks_def.js';
import { loadDynamicBlocks } from './block_loader.js';
import { initJavaGenerator } from './generator_java.js';

// Init Blockly for Docs (Headless-like but rendering to specific divs)
defineBlocks();
const javaGenerator = initJavaGenerator();
loadDynamicBlocks(Blockly, javaGenerator);

// Load Data
fetch('docs_data.json')
    .then(response => response.json())
    .then(data => {
        renderDocs(data);
    });

const renderDocs = (data) => {
    const sidebar = document.getElementById('sidebar-links');
    const content = document.getElementById('docs-content');
    
    // Clear Loading State
    sidebar.innerHTML = '';
    content.innerHTML = '';

    // Render Sections
    data.core_blocks.forEach(section => {
        // Sidebar Link
        const link = document.createElement('a');
        link.href = `#${section.id}`;
        link.className = "text-gray-400 hover:text-green-400 block transition-colors";
        link.innerText = section.title;
        sidebar.appendChild(link);

        // Main Content Section
        const sectionDiv = document.createElement('section');
        sectionDiv.id = section.id;
        sectionDiv.className = "mb-16 border-t border-gray-800 pt-16 first:border-0 first:pt-0";
        
        sectionDiv.innerHTML = `
            <h3 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-green-500"></span> ${section.title}
            </h3>
            <p class="text-gray-400 mb-8">${section.description}</p>
        `;

        // Blocks Grid
        const grid = document.createElement('div');
        grid.className = "grid grid-cols-1 gap-8";

        section.blocks.forEach(blockInfo => {
            const card = document.createElement('div');
            card.className = "bg-gray-900 border border-gray-800 rounded-lg p-6";
            
            // Header
            const header = document.createElement('div');
            header.className = "mb-4";
            header.innerHTML = `
                <h4 class="font-bold text-gray-200 mb-1">${blockInfo.type.replace(/^.*_/, '').replace(/_/g, ' ')}</h4>
                <p class="text-sm text-gray-500">${blockInfo.desc}</p>
            `;
            card.appendChild(header);

            // Workspace Container
            const wsContainer = document.createElement('div');
            wsContainer.className = "example-workspace";
            wsContainer.id = `ws-${blockInfo.type}`;
            card.appendChild(wsContainer);

            grid.appendChild(card);
            sectionDiv.appendChild(grid);

            // Defer Rendering
            setTimeout(() => {
                injectReadOnlyBlock(wsContainer.id, blockInfo.type);
            }, 100);
        });

        content.appendChild(sectionDiv);
    });
};

const injectReadOnlyBlock = (containerId, blockType) => {
    const ws = Blockly.inject(containerId, {
        readOnly: true,
        scrollbars: false,
        zoom: { controls: false, wheel: false, startScale: 0.8 },
        theme: Blockly.Theme.defineTheme('dark_docs', {
            'base': Blockly.Themes.Classic,
            'componentStyles': {
                'workspaceBackgroundColour': '#1f2937',
                'toolboxBackgroundColour': '#1f2937', 
                'flyoutBackgroundColour': '#1f2937'
            }
        })
    });

    // Add Block
    const block = ws.newBlock(blockType);
    block.initSvg();
    block.render();
    
    // Center it
    ws.centerOnBlock(block.id);
    
    // Slight shift to look nice
    // ws.scroll(10, 10);
};
