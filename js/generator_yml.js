// plugin.yml Generator

export const generatePluginYml = (projectName, version, commands, author) => {
    let yml = `name: ${projectName}
version: ${version}
main: com.example.plugin.Main
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

