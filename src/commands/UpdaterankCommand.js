module.exports.help = {
	name: "updaterank",
	aliases: ["обновитьроли"],
	description: "[VIP] Включить/выключить автоматическое обновление ролей участников (интервал - 30 секунд)",
	usage: null,
    category: "vip",
    humanizedCategory: "VIP"
};

module.exports.execute = ({ message, MessageEmbed }) => {
    const embed = new MessageEmbed()
        .setColor("RED")
        .setTitle(`❌ Ошибка!`)
        .setDescription(`Автоматическая смена ролей более невозможна.\nТех. поддержка **Discord** до такой степени странные, что как раз таки повлекло за собой вырезание данной возможности.\n\nЯ буду рад, если кто-то закинет какую-то копеечку мне на карту, поскольку **VimeVerify** не имеет никакой монетизации.\nНомер карты: **\`4890 4946 6715 3977\`**`)
        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

    return message.channel.send(embed);
};

// module.exports.execute = ({ client, message, args, MessageEmbed }) => {
//     if(Boolean(message.guild.data.bonus) == false) {
//         const embed = new MessageEmbed()
//             .setColor("RED")
//             .setTitle(`❌ Ошибка!`)
//             .setDescription(`Чтобы использовать эту команду, требуется VIP.\nПолучение доступа к данной команде: <https://vime.sqdsh.top/donate>`)
//             .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
//             .setTimestamp();

//         return message.channel.send(embed);
//     }

//     if(!message.member.hasPermission("MANAGE_ROLES")) {
//         const embed = new MessageEmbed()
//             .setColor("RED")
//             .setTitle(`❌ Ошибка!`)
//             .setDescription(`У Вас нет прав на управление ролями.`)
//             .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
//             .setTimestamp();

//         return message.channel.send(embed);
//     }

//     const autoupdate = (Boolean(message.guild.data.autoupdate) == true) ? false : true;
//     return global.r.table('guilds')
//         .filter({ id: message.guild.data.id })
//         .update({ autoupdate: (autoupdate == false) ? 0 : 1 })
//         .run(global.conn).then(() =>
//             message.channel.send(`✅ | Автоматическое обновление ролей участников сервера ${(autoupdate == false) ? "выключено" : "включено"}!`)
//         ).error(async err => {
//             console.error(err.stack);
//             await message.react("🤖");
//             return message.react("❌");
//         });
// };