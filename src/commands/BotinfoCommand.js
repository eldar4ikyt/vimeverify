const pkg = require("../../package.json");
const settings = require("../settings/master.json");

// function fiveSnippet(number, one, two, five) {
//     number = Math.abs(number);
//     number %= 100;
//     if (number >= 5 && number <= 20) {
//         return five;
//     }
//     number %= 10;
//     if (number == 1) {
//         return one;
//     }
//     if (number >= 2 && number <= 4) {
//         return two;
//     }
//     return five;
// };

module.exports.help = {
	name: "botinfo",
	aliases: ["bot", "bs", "бот"],
	description: "Информация о боте **VimeVerify**",
	usage: null,
    category: "other",
    humanizedCategory: "Другое"
};

module.exports.execute = async ({ client, message, MessageEmbed }) => {
    let owners = [];
    for (const developerID of settings.global_admin) {
        owners.push(client.users.cache.get(developerID).tag);
    }

    // let serversWords = ["сервер", "сервера", "серверов"];
    let servers = await client.shard.fetchClientValues("guilds.cache.size");
    servers = servers.reduce((acc, guildCount) => acc + guildCount, 0);

    // let text = [
    //     `Привет! Меня назвали **${client.user.username}**. Я бот, позволяющий автоматизировать выдачу роли донатерам сервера **VimeWorld MiniGames**.`,
    //     `На данный момент, меня используют **${servers} ${fiveSnippet(servers, ...serversWords)}**.`,
    //     `Данный сервер находится на **${client.shard.ids[0]}-ом** осколке. Всего осколков: **${client.shard.ids.length} шт.**`,
    //     ``,
    //     `Я очень прост в использовании, так что не спеши меня удалять с сервера.`,
    //     `Подробная документация по использованию есть тут: [нажми сюда](https://vime.sqdsh.top/)`,
    //     ``,
    //     `Тема на форуме: [нажми сюда](https://forum.vimeworld.ru/topic/308527-vimeverify/)`,
    //     `Инвайт-ссылка на добавление бота: [нажми сюда](${(await (client.generateInvite(["MANAGE_ROLES", "EMBED_LINKS"])))})`
    // ];

    let text = [
        `Вот что мы можем предоставить:`,
        `\`\`\`md`,
        `1. Сортировка игроков по ролям (привилегии, чин в гильдии)`,
        `2. Доступ к статистике игрока/гильдии из Discord`,
        `3. Смена префикса, а также автоматическая смена ролей при новой привилегии [бонус]`, 
        `\`\`\``,
        `Тема, посвящённая проекту на форуме **VimeWorld**: **[click](https://forum.vimeworld.ru/topic/308527-vimeverify/)**`,
        `Пригласить бота на свой сервер: **[click](${(await (client.generateInvite(["MANAGE_ROLES", "EMBED_LINKS"])))})**`,
        `Документация по использованию бота: **[click](https://vime.sqdsh.top/)**`,
        `Сайт создателя бота: **[click](https://me.sqdsh.top/)**`,
        ``,
        `> **Если Вам не безразлична судьба бота, будьте добры, пожалуйста, оценить его на следующих сайтах:**`,
        `> **• SD.C: [click](https://bots.server-discord.com/${client.user.id})**`,
        `> **• BotiCord: [click](https://boticord.top/bot/${client.user.id})**`
    ];

    const embed = new MessageEmbed()
        .setColor(message.guild.me.displayHexColor || 0x7289da)
        .setAuthor(`[${pkg.name}] | v${pkg.version}`, client.user.displayAvatarURL({ dynamic: true }))
        .setTitle("Выдача ролей для игроков MiniGames уже здесь!")
        .setDescription(text.join("\n"))
        .addField(`> Серверов`, `**\`${servers}\` / \`${(await global.r.table('guilds').run(global.conn).error(console.error)).length}\`**`, true)
        .addField(`> Созданных ролей`, `**\`${(await global.r.table('roles').run(global.conn).error(console.error)).length}\`**`, true)
        .addField(`> Привязанных аккаунтов`, `**\`${(await global.r.table('users').run(global.conn).error(console.error)).length}\`**`, true)
        .addField(`> Текущий осколок сервера`, `**\`${client.shard.ids[0]}\` / \`${client.shard.ids.length}\`**`, true)
        .addField(`> Разработчики`, `**\`${owners.join(" | ")}\`**`, true)
        .addField(`> Версия Node.js`, `**\`${process.version}\`**`, true)
        .addField(`> Версия Discord.js`, `**\`v${pkg.dependencies['discord.js'].replace("^", "")}\`**`, true)
        .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }));

    return message.channel.send(embed);
};
