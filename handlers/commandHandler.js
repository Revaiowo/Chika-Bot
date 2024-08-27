import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export const loadCommands = async (client, __dirname) =>{

    const foldersPath = path.join(__dirname, 'commands'); // this gives path to the commands folder
    const commandFolders = fs.readdirSync(foldersPath); // it puts all folders inside commands in this arra

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // This puts all the files wihtin that folder into an array

        for (const file of commandFiles) {

            const filePath = path.join(commandsPath, file);
            const fileUrl = pathToFileURL(filePath); // need to turn path into url cause import does not accept path

            let command  = await import(fileUrl.href);
            command = command.default;
            
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);

            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
}