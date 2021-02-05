const vimeauth = new (require("../vimeauth.js"))(process.env.VIME_TOKEN);
module.exports.help = {
	name: "login",
	aliases: ["войти"],
	description: "Добавление аккаунта",
	usage: null,
    category: "general",
    humanizedCategory: "Главное"
};

module.exports.execute = async ({ client, message, MessageEmbed }) => {
    const allUsers = await global.r.table('users').run(global.conn).error(console.error);
    const user = allUsers.find(user => user.userID == message.author.id);
    if(user) {
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle(`❌ Ошибка!`)
            .setDescription(`Вы уже авторизованы!`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        return message.channel.send(embed);
    } else {
        const token = await vimeauth.verify(message.author.id);
        const embed = new MessageEmbed()
            .setColor(message.guild.me.displayHexColor || 0x7289da)
            .setTitle("Добавление аккаунта")
            .setDescription(`Для добавления аккаунта в базу данных, нам требуется ваш API-токен.\nПерейдите по ссылке ниже, чтобы продолжить верификацию.\n\n<${process.env.VIMEAUTH_URI}/verify/${token}>`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        message.react("✅")
            .catch(() => message.reply("хм, странно, я не могу поставить реакцию."));

        return message.author.send(embed)
            .catch(() => message.reply("у Вас закрыты личные сообщения."));
    }
};