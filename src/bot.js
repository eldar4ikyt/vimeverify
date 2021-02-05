global.cachedUsers = {};
const settings = require("./settings/master.json");
const database = require("./settings/database.json");

const fs = require("fs");
global.r = require("rebirthdb-js")({
	pool: false,
	cursor: false
});

global.r.connect(database)
	.then((connection) => {
		connection.on('error', console.error);
		global.conn = connection;
	});

const vimeauth = new (require("./vimeauth.js"))(process.env.VIME_TOKEN);
const express = require("express");
const app = express();

app.get('/callback', async (req, res) => {
    const secret = req.query.secret;
    const user = req.query.user;
    const nick = req.query.nick;
    
    if(!secret || !user || !nick) return res.status(200).json(['error', 'NoArgs']);
    if(secret !== process.env.VIMEAUTH_TOKEN) return res.status(200).json(['error', 'InvalidSecret']);
    
    const allUsers = await global.r.table('users').run(global.conn).error(console.error);
    const userDB = allUsers.find((userDB) => userDB.userID == user);
    if(userDB) return res.status(200).json([false, 'InDB']);
	
	let player = await vimeauth.userByNickname(nick);
	global.r.table('users')
		.insert([{
			userID: user,
			nickname: player[0].username,
			vimeID: player[0].id
		}]).run(global.conn).error(console.error);
	
	return res.status(200).json({ status: true });
});

app.get('/vip/:guildID', async (req, res) => {
    const secret = req.query.secret;
    const id = req.params.guildID;
    
    if(!secret || !id) return res.status(200).json(['error', 'NoArgs']);
    if(secret !== process.env.VIMEAUTH_TOKEN) return res.status(200).json(['error', 'InvalidSecret']);
    
    const allGuilds = await global.r.table('guilds').run(global.conn).error(console.error);
	const guild = allGuilds.find((guild) => guild.guildID == id);
	if(!guild) return res.status(200).json([false, 'OutDB']);
    
	global.r.table('guilds')
		.filter({ guildID: id }).update({
			bonus: 1
		}).run(global.conn).error(console.error);
	
	return res.status(200).json({ status: true });
});

const { Client, MessageEmbed, Collection } = require('discord.js');
const client = new Client({
	presence: { activity: { name: `${settings.prefix}help`, type: 3 } }
});

client.commands = new Collection();
const commandFiles = fs.readdirSync(__dirname + "/commands")
	.filter(file =>
		file.endsWith(".js")
		&& !file.endsWith(".disabled.js")
	);

for (const file of commandFiles) {
	const command = require(`${__dirname}/commands/${file}`);
	console.info(`[BOT] "${file}" --> "${command.help.name}"`);
	client.commands.set(command.help.name, command);
}

client.once("ready", () => {
	// setInterval(async () => {
	// 	const roles = await global.r.table('roles').run(global.conn).error(console.error);
	// 	const users = await global.r.table('users').run(global.conn).error(console.error);

	// 	let userIDs = [];
	// 	for (let user of users) {
	// 		userIDs.push(user.vimeID);
	// 	}

	// 	let usersData = await vimeauth.usersByID(userIDs);
	// 	for (let user of usersData) {
	// 		if(!global.cachedUsers[usersData.id]) global.cachedUsers[usersData.id] = user;
	// 		if(global.cachedUsers[usersData.id].rank !== user.rank) {
	// 			user.data = users.find(userInDB => userInDB.vimeID == user.id);
	// 			if(!user.data) return;

	// 			for (let guild of client.guilds.cache.array()) {
	// 				guild.members.fetch(user.data.userID)
	// 					.then(userInGuild => {
	// 						if(!userInGuild) return;

	// 						let oldRole = roles.find(role => role.guildID == guild.id && role.rank == global.cachedUsers[usersData.id].rank);
	// 						let newRole = roles.find(role => role.guildID == guild.id && role.rank == user.rank);
	// 						if(!newRole) return;
	// 						if(!oldRole) return userInGuild.roles.add(newRole.roleID);
							
	// 						userInGuild.roles.remove(oldRole.roleID);
	// 						userInGuild.roles.add(newRole.roleID);
	// 					}).catch(() => {});
	// 			}
	// 		}
	// 	}
	// }, 70000);

	if(client.shard.ids[0] == 0) app.listen(settings.port, () => console.log("[GLOBALIZE] Callback-server is started!"));
	return console.info(`[BOT] Ready!`);
});

client.on("message", async (message) => {
	if(message.author.bot) return;

	const findAll = await global.r.table('guilds').run(global.conn).error(console.error);
	message.guild.data = findAll.filter(guild => guild.guildID == message.guild.id)[0];
	if(!message.guild.data) {
		global.r.table('guilds').insert([{
			guildID: message.guild.id,
			prefix: settings.prefix,
			bonus: 0, autoupdate: 0
		}]).run(global.conn).error(console.error);

		let messageArray = [
			`:white_check_mark: | **VimeVerify** был успешно добавлен на сервер!`,
			``,
			`Инструкция по созданию ролей: <https://vime.sqdsh.top/setup#roles>`,
			`Инструкция по привязке аккаунта и получению роли: <https://vime.sqdsh.top/role>`,
			``,
			`\`P.S.\` Если я написал не туда \`->\` ||извините меня, это сообщение будет отправлено только один раз||.`
		];

		return message.channel.send(messageArray.join("\n"));
	}
	
	if(!message.content.startsWith(message.guild.data.prefix)) return;
	const args = message.content.slice(message.guild.data.prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if(!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send(
		`:warning: | ${message.author}, я не могу работать без встраивания предпросмотра для ссылок!
		\nТребуется включить боту это правило в настройках роли: https://i.imgur.com/IpcgkNH.png`
	);

	if(!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send(
		`:warning: | ${message.author}, я не могу работать без управления ролями!
		\nТребуется включить боту это правило в настройках роли: https://i.imgur.com/pDd76b2.png`
	);
	
	const command = client.commands.find(command =>
		command.help.name == commandName
		|| command.help.aliases.includes(commandName)
	); if(!command) return;
	if(command.help.category == "BotOwner" && !settings["global_admin"].includes(message.author.id)) return;
	
	return command.execute({ client, message, args, MessageEmbed, command, commandName });
});

console.info("\n[BOT] Trying to login to bot account...");
client.login(process.env.TOKEN);
