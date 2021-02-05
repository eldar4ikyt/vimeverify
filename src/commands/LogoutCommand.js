module.exports.help = {
	name: "logout",
	aliases: ["выйти"],
	description: "Удаление аккаунта",
	usage: null,
    category: "general",
    humanizedCategory: "Главное"
};

module.exports.execute = async ({ client, message, MessageEmbed }) => {
    const allUsers = await global.r.table('users').run(global.conn).error(console.error);
    const user = allUsers.find(user => user.userID == message.author.id);
    if(!user) {
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle(`❌ Ошибка!`)
            .setDescription(`Вы не имеете аккаунта!`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        return message.channel.send(embed);
    } else return global.r.table('users').filter({ id: user.id }).delete().run(global.conn).then(() => {
        const embed = new MessageEmbed()
            .setColor(message.guild.me.displayHexColor || 0x7289da)
            .setTitle("Удаление аккаунта")
            .setDescription(`Привязка вашего аккаунта VimeWorld и Discord была прервана. Вы больше не сможете получить роль на другом сервере.\nДля повторной авторизации, используйте команду \`${message.guild.data.prefix + "login"}\`.`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        return message.channel.send(embed);
    }).error(console.error);
};