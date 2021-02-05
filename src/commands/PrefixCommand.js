module.exports.help = {
	name: "prefix",
	aliases: ["префикс"],
	description: "Сменить префикс бота",
	usage: "<префикс (до 16 символов)>",
    category: "other",
    humanizedCategory: "Другое"
};

module.exports.execute = ({ client, message, args, MessageEmbed }) => {
    const prefix = args[0];
	if(args.length < 1 || prefix.length > 16) {
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle(`❌ Ошибка!`)
            .setDescription(
                (args.length < 1) ? "Вы не указали префикс для смены." :
                (prefix.length > 16) ? "Длина префикса должна не превышать 16-ти символов." : "None")
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        return message.channel.send(embed);
    }

    return global.r.table('guilds')
        .filter({ id: message.guild.data.id })
        .update({ prefix })
        .run(global.conn).then(() =>
            message.react("✅")
        ).error(async err => {
            console.error(err.stack);
            await message.react("🤖");
            return message.react("❌");
        });
};