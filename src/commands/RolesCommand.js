const roles = require("../settings/roles.json");
module.exports.help = {
	name: "roles",
	aliases: ["роли"],
	description: "Список ролей, записанных в базу данных",
	usage: null,
    category: "general",
    humanizedCategory: "Главное"
};

module.exports.execute = async ({ client, message, MessageEmbed }) => {
    if(!message.member.hasPermission("MANAGE_ROLES")) {
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle(`❌ Ошибка!`)
            .setDescription(`У Вас нет прав на управление ролями.`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        return message.channel.send(embed);
    }

    const embed = new MessageEmbed()
		.setColor(message.guild.me.displayHexColor || 0x7289da)
		.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
		.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
		.setTimestamp();

    const allRoles = (
        await global.r.table('roles')
            .run(global.conn).error(console.error)
        ).filter(r => r.guildID == message.guild.id);

    for (const role of allRoles) {
        let roleHumanized = message.guild.roles.cache.get(role.roleID);
        if(!roleHumanized) roleHumanized = "\`None\`";

        embed.addField(
            roles.find((r) => r.group == role.rank).name,
            `Установленная роль: ${roleHumanized}`,
            true
        );
    }

	return message.channel.send(embed);
};