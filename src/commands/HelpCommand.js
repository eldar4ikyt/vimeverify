module.exports.help = {
	name: "help",
	aliases: ["хелп", "помощь"],
	description: "Помощь по командам",
    usage: "[команда]",
    category: "other",
    humanizedCategory: "Другое"
};

module.exports.execute = ({ client, message, args, MessageEmbed, commandName }) => {
	if(!args[0]) {
        const embed = new MessageEmbed()
            .setColor(message.guild.me.displayHexColor || 0x7289da)
            .setTitle(`Документация по ${client.user.username}`)
            .setURL("https://vime.sqdsh.top/")
            .setDescription(`\`\`\`Все обязательные аргументы заключены в <аргумент>\nВсе необязательные аргументы заключены в [аргумент]\n\nИспользуй ${message.guild.data.prefix + commandName} [команда] чтобы узнать больше о команде.\`\`\``)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        let categories = {};
        client.commands.map((command) => {
            if(command.help.category == "BotOwner") return;
            if(!categories[command.help.humanizedCategory]) categories[command.help.humanizedCategory] = [];
            categories[command.help.humanizedCategory].push(command.help.name);
        });

        Object.keys(categories).forEach(category => embed.addField(
            category, `\`${categories[category].join("` `")}\``
        ));

        if(Boolean(message.guild.data.bonus) == true) embed.addField("Поддержка", `На этом сервере активированы VIP-возможности. <:smush:700079820910100541>`);
        return message.channel.send(embed);
    } else {
        const command = client.commands.find(command =>
            command.help.name == args[0]
            || command.help.aliases.includes(args[0])
        ); if(!command || (command && command.help.category == "BotOwner")) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle(`❌ Ошибка!`)
                .setDescription(`Такой команды не существует, дурааашка.`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            return message.channel.send(embed);
        }

        const embed = new MessageEmbed()
            .setColor(message.guild.me.displayHexColor || 0x7289da)
            .setAuthor(message.guild.data.prefix + args[0], client.user.displayAvatarURL({ dynamic: true }))
            .setDescription("Помощь по команде")
            .addField(
                "Алиасы для использования команды",
                `\`${(command.help.aliases.length <= 0) ? "None" : command.help.aliases.join("` `")}\``
            ).addField(
                "Как использовать команду?",
                `\`\`\`${message.guild.data.prefix + args[0]}${(command.help.usage !== null) ? ` ${command.help.usage}` : ""}\`\`\``
            ).setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        return message.channel.send(embed);
    }
};