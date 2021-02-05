const guildTagColor = {
	"&0": "000000",
	"&1": "0000AA",
	"&2": "00AA00",
	"&3": "00AAAA",
	"&4": "AA0000",
	"&5": "AA00AA",
	"&6": "FFAA00",
	"&7": "AAAAAA",
	"&8": "555555",
	"&9": "5555FF",
	"&a": "55FF55",
	"&b": "55FFFF",
	"&c": "FF5555",
	"&d": "FF55FF",
	"&e": "FFFF55",
	"&f": "FFFFFF"
};

const moment = require("moment");
require("moment-duration-format");

const roles = require("../settings/roles.json");
const vimeauth = new (require("../vimeauth.js"))(process.env.VIME_TOKEN);

module.exports.help = {
	name: "info",
	aliases: ["инфо", "userdata", "data", "userinfo", "user"],
	description: "Статистика с VimeWorld",
	usage: null,
    category: "general",
    humanizedCategory: "Главное"
};

module.exports.execute = async ({ client, commandName, message, args, MessageEmbed }) => {
    let subcommand = args.shift(" ");
    if(!subcommand) {
        const embed = new MessageEmbed()
            .setColor(message.guild.me.displayHexColor || 0x7289da)
            .setTitle(exports.help.description)
            .setDescription("Данная команда позволяет работать с открытой статистикой игроков/гильдий сервера **MiniGames**.")
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        embed.addField("Информация о игроке", `Использование команды: \`${message.guild.data.prefix + commandName} [user <никнейм>|discord <@упоминание/ID>]\``);
        embed.addField("Информация о гильдии", `Использование команды: \`${message.guild.data.prefix + commandName} [guild -i <ID>|-t <тэг>|-n <название>\``);
        return message.channel.send(embed);
    }
    
    let whatStringUser = `:warning: | Вы что-то явно делаете не так.\nИспользование команды: \`${message.guild.data.prefix + commandName} [user <никнейм>|discord <@упоминание/ID>]\``;
    let whatStringGuild = `:warning: | Вы что-то явно делаете не так.\nИспользование команды: \`${message.guild.data.prefix + commandName} [guild -i <ID>|-t <тэг>|-n <название>\``;
    
    if(subcommand == "user") {
        let member = args.join(" ");
        if(!member) return message.channel.send(whatStringUser);

        const user = await vimeauth.userByNicknameAndData(member);
        if(!user.game[0]) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle(`❌ Ошибка!`)
                .setDescription(`Игрока с никнеймом \`${member}\` никогда не существовало на сервере.`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
    
            return message.channel.send(embed);
        } else {
            let memberAccount = null;
            if(user.data !== null) memberAccount = await client.users.fetch(user.data.userID);

            let text = [
                `ID аккаунта: \`${user.game[0].id}\``,
                `Уровень: \`${user.game[0].level} ур. [${Math.round(user.game[0].levelPercentage * 100)}%]\``,
                `Наигранное время: \`${moment.duration(new Date(user.game[0].playedSeconds * 1000)).format("D [дн.] H [ч.] m [мин.] s [сек.]")}\``,
                `Последний вход в игру: \`${moment(new Date(user.game[0].lastSeen * 1000)).locale("ru").format("LLL")}\``
            ];
    
            const embed = new MessageEmbed()
                .setColor(roles.find(u => u.group == user.game[0].rank).color)
                .setTitle(`Профиль игрока ${roles.find(u => u.group == user.game[0].rank).prefix} ${user.game[0].username}`)
                .setThumbnail(`https://skin.vimeworld.ru/helm/3d/${user.game[0].username}.png`)
                .setDescription(text.join("\n"))
                .addField("Гильдия", (user.game[0].guild !== null) ? `Состоит в гильдии \`${((user.game[0].guild.tag !== null) ? `<${user.game[0].guild.tag}> ` : "") + user.game[0].guild.name}\` (\`${user.game[0].guild.level} ур. [${Math.round(user.game[0].guild.levelPercentage * 100)}%]\`)` : "Не состоит в гильдии")
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
    
            embed.setAuthor((memberAccount !== null) ? `${memberAccount.username}#${memberAccount.discriminator}` : "Не привязан", (memberAccount !== null) ? `https://cdn.discordapp.com/avatars/${memberAccount.id}/${memberAccount.avatar}.${(memberAccount.avatar.includes("a_") ? "gif" : "png")}` : client.user.displayAvatarURL({ dynamic: true }))
            return message.channel.send(embed);
        }
    }

    if(subcommand == "discord") {
        let member = message.guild.member(
            message.mentions.users.first()
            || message.guild.members.cache.get(args[0])
        );
        if(!member) member = message.member;
        
        const user = await vimeauth.userByID(member.user.id);
        if(!user[0]) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle(`❌ Ошибка!`)
                .setDescription(`${member} (\`${member.user.tag}\`) должен авторизоваться чтобы другие могли просмотреть его профиль.`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
    
            return message.channel.send(embed);
        } else {
            let text = [
                `ID аккаунта: \`${user[0].id}\``,
                `Уровень: \`${user[0].level} ур. [${Math.round(user[0].levelPercentage * 100)}%]\``,
                `Наигранное время: \`${moment.duration(new Date(user[0].playedSeconds * 1000)).format("D [дн.] H [ч.] m [мин.] s [сек.]")}\``,
                `Последний вход в игру: \`${moment(new Date(user[0].lastSeen * 1000)).locale("ru").format("LLL")}\``
            ];
    
            const embed = new MessageEmbed()
                .setColor(roles.find(u => u.group == user[0].rank).color)
                .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
                .setTitle(`Профиль игрока ${roles.find(u => u.group == user[0].rank).prefix} ${user[0].username}`)
                .setThumbnail(`https://skin.vimeworld.ru/helm/3d/${user[0].username}.png`)
                .setDescription(text.join("\n"))
                .addField("Гильдия", (user[0].guild !== null) ? `Состоит в гильдии \`${((user[0].guild.tag !== null) ? `<${user[0].guild.tag}> ` : "") + user[0].guild.name}\` (\`${user[0].guild.level} ур. [${Math.round(user[0].guild.levelPercentage * 100)}%]\`)` : "Не состоит в гильдии")
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
    
            return message.channel.send(embed);
        }
    }

    if(subcommand == "guild") {
        let type = args.shift(" ");
        if(!type) return message.channel.send(whatStringGuild);

        let str = args.join(" ");
        if(!str) return message.channel.send(whatStringGuild);

        const guild = await vimeauth.guild(type, str);
        if(guild.error) {
            const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle(`❌ Ошибка!`)
                .setDescription(guild.error.error_msg)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
    
            return message.channel.send(embed);
        } else {
            let leader = [];
            let officer = [];
            var total = {
                coins: 0,
                xp: 0
            };

            guild.members.forEach((member) => {
                total.coins += member.guildCoins;
                total.xp += member.guildExp;
                if(member.status == "LEADER") leader.push(member.user.username);
                if(member.status == "OFFICER") officer.push(member.user.username);
            });

            var info = `ID: \`${guild.id}\`\n`+
            `Уровень: ${guild.level} ур. \`[${Math.floor(guild.levelPercentage * 100)}%]\`\n`+
            `Дата создания: \`${moment(guild.created * 1000).locale('ru').format('LLL')}\`\n`+
            `Вложено коинов: \`${total.coins}\`\n`+
            `Вложено опыта: \`${total.xp}\``;

            var staff = `Лидер гильдии: \`${leader[0]}\`\n`+
            `Офицеры гильдии: \`${officer.length} чел.\``;

            let perks = '';
            Object.keys(guild.perks).forEach((objectKey) => {
                let perk = guild.perks[objectKey];
                perks += `• ${perk.name}: \`${perk.level} ур.\`\n`;
            });
    
            const embed = new MessageEmbed()
                .setColor(guildTagColor[guild.color])
                .setTitle(`Статистика гильдии ${(guild.tag == null) ? "" : `<${guild.tag}> `}${guild.name}`)
                .setDescription(info)
                .addField('Персонал гильдии', staff)
                .addField('Перки гильдии', perks)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            if(guild.avatar_url !== null) embed.setThumbnail(guild.avatar_url);
            return message.channel.send(embed);
        }
    }
};
