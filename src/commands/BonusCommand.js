const wallet = new (require("node-qiwi-api").callbackApi)(process.env.QIWI_TOKEN);
module.exports.help = {
	name: "bonus",
	aliases: ["бонус"],
	description: "Получить VIP-возможности",
	usage: null,
    category: "other",
    humanizedCategory: "Другое"
};

module.exports.execute = async ({ client, message, MessageEmbed }) => {
    if(Boolean(message.guild.data.bonus) == true) {
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle(`❌ Ошибка!`)
            .setDescription(`У данного сервера уже подключены VIP-возможности!`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        return message.channel.send(embed);
    } else return wallet.getOperationHistory(process.env.QIWI_NUMBER, { rows: 50, operation: "IN" }, (err, data) => {
        if(err) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle(`❌ Ошибка!`)
                .setDescription(`Произошла ошибка при получении информации из базы данных. Попробуйте повторить запрос позднее.`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            return message.channel.send(embed);
        }

        const payment = data.data.find(payment => payment.comment == message.guild.id && payment.status == "SUCCESS");
        if(!payment) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle(`❌ Ошибка!`)
                .setDescription(`Для данного сервера никто не производил пожертвование.\nУбедитесь что вы указали при переводе ID Discord-сервера. Если-же это не так, просто сделайте ещё один донат, мы не просим конкретную цену за доп. функции.`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            return message.channel.send(embed);
        } else return global.r.table('guilds')
            .filter({ id: message.guild.data.id })
            .update({ bonus: 1 })
            .run(global.conn).then(() => {
                const embed = new MessageEmbed()
                    .setColor(message.guild.me.displayHexColor || 0x7289da)
                    .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
                    .setTitle("Активация VIP-возможностей")
                    .setDescription(`Ура! ${message.author} (\`${message.author.tag}\`) активировал VIP-возможности для данного сервера! 🎉`)
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();

                return message.channel.send(embed);
            }).error(err => {
                const embed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(`❌ Ошибка!`)
                    .setDescription(`Произошла ошибка при получении информации из базы данных. Попробуйте повторить запрос позднее.`)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();

                console.error(err.stack);
                return message.channel.send(embed);
            });
    });
};