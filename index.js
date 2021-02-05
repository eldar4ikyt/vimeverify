require("dotenv-flow").config();
const { ShardingManager } = require("discord.js");
const manager = new ShardingManager("./src/bot.js", { token: process.env.TOKEN });

manager.spawn();
manager.on("shardCreate", (shard) => console.info(`[#${shard.id}] Boot up...`));