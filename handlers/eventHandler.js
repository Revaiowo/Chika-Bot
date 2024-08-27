import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

export const loadEvents = async (client, __dirname) =>{

    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {

        const filePath = path.join(eventsPath, file);
        const fileUrl = pathToFileURL(filePath);

        let event = await import(fileUrl.href);
        event = event.default;

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}