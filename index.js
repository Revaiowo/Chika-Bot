import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { Client, Collection, GatewayIntentBits } from 'discord.js'
import { loadEvents } from './handlers/eventHandler.js';
import { loadCommands } from './handlers/commandHandler.js';
import { connectDB } from './database/db.js';

dotenv.config();
const { TOKEN, MONGO_URI} = process.env;

// Creating new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
client.cooldowns = new Collection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Normal use of __dirname is not allowed in type module


client.login(TOKEN)
    .then(() => {
        loadEvents(client, __dirname);
        loadCommands(client, __dirname);
        connectDB(MONGO_URI);
    })
    .catch(error => console.log(error));
