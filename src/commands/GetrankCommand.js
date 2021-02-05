const vimeauth = new (require("../vimeauth.js"))(process.env.VIME_TOKEN);
module.exports.help = {
	name: "getrank",
	aliases: ["получитьроль"],
	description: "Получить роль в соответствии с вашим донат-статусом",
	usage: null,
    category: "general",
    humanizedCategory: "Главное"
};

module.exports.execute = async ({ client, message, MessageEmbed }) => {
    const user = await vimeauth.userByID(message.author.id);
    if(!user[0]) {
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle(`❌ Ошибка!`)
            .setDescription(`Вы не авторизованы!`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        return message.channel.send(embed);
    } else {
        const roles = (
            await global.r.table('roles')
                .run(global.conn).error(console.error)
            ).filter(r => r.guildID == message.guild.id);

        const roleData = roles.find(r => r.rank == user[0].rank);
        if(!roleData) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle(`❌ Ошибка!`)
                .setDescription(`Роль, которую вы хотите получить, не найдена в базе данных. Скорее всего никто ещё не настроил бота. :/`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
    
            return message.channel.send(embed);
        } else {
            const role = message.guild.roles.cache.get(roleData.roleID);
            if(!role) {
                const embed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(`❌ Ошибка!`)
                    .setDescription(`Роль, которую вы хотите получить, не найдена на сервере. Скорее всего её удалили. :/`)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();
        
                return message.channel.send(embed);
            } else return message.member.roles.add(role)
                .then(() => {
                    const embed = new MessageEmbed()
                        .setColor(message.guild.me.displayHexColor || 0x7289da)
                        .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
                        .setTitle("Получение роли")
                        .setDescription(`Ура! Вы получили роль ${role} (\`${role.name}\`)! 🎉`)
                        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                        .setTimestamp();

                    return message.channel.send(embed);
                }).catch((e) => {
                    const embed = new MessageEmbed()
                        .setColor("RED")
                        .setTitle(`❌ Ошибка!`)
                        .setDescription(`Роль, которую вы хотите получить, невозможно добавить по каким-то непонятным причинам. :/`)
                        .addField("Получаемая ошибка", `\`\`\`js\n${e.stack}\n\`\`\``)
                        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                        .setTimestamp();
            
                    return message.channel.send(embed);
                });
        }
    }
};