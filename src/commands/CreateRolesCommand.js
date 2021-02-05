const roles = require("../settings/roles.json");
module.exports.help = {
	name: "createroles",
	aliases: ["создатьроли"],
	description: "Создать роли для верификации",
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

    const rolesData = (
        await global.r.table('roles')
            .run(global.conn).error(console.error)
        ).filter(r => r.guildID == message.guild.id);

    if(rolesData.length <= 0) {
        let count = [];
        const msg = await message.channel.send(":warning: | Создание ролей...");
        for (const role of roles.reverse()) {
            message.guild.roles.create({ data: {
                name: `VimeWorld ${role.prefix}`,
                color: role.color,
                hoist: true,
                mentionable: true
            }, reason: this.help.description }).then(r => {                
                count.push({
                    guildID: message.guild.id,
                    rank: role.group,
                    roleID: r.id
                });

                if(count.length >= 14) {
                    global.r.table('roles').insert(count).run(global.conn).error(console.error);
                    return msg.edit(":white_check_mark: | Роли созданы!");
                }
            });
        }
    } else return message.react("❌");
};