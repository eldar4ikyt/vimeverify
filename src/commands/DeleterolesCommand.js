module.exports.help = {
	name: "deleteroles",
	aliases: ["удалитьроли"],
	description: "Удалить роли для верификации из базы данных и на сервере, если такое возможно",
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

    const roles = (
        await global.r.table('roles')
            .run(global.conn).error(console.error)
        ).filter(r => r.guildID == message.guild.id);

    if(roles.length >= 1) {
        for (let role of roles) {
            const roleObject = message.guild.roles.cache.get(role.roleID);
            if(!roleObject) return global.r.table('roles')
                .filter({ id: role.id })
                .delete()
                .run(global.conn).error(console.error);
            else {
                roleObject.delete();
                return global.r.table('roles')
                    .filter({ id: role.id })
                    .delete()
                    .run(global.conn).error(console.error);
            }
        }

        return message.react("✅");
    } else return message.react("❌");
};