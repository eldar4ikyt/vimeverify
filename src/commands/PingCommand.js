module.exports.help = {
	name: "ping",
	aliases: ["пинг"],
	description: "Понг!",
	usage: null,
    category: "other",
    humanizedCategory: "Другое"
};

module.exports.execute = ({ client, message, args, MessageEmbed }) => {
	const embed = new MessageEmbed()
		.setColor(message.guild.me.displayHexColor || 0x7289da)
		.setDescription(`:ping_pong: **${client.ws.ping}ms**`)
		.setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
		.setTimestamp();

	return message.channel.send(embed);
};