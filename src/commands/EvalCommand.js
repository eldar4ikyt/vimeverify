const vimeauth = new (require("../vimeauth.js"))(process.env.VIME_TOKEN);
const roles = require("../settings/roles.json");

module.exports.help = {
	name: "eval",
	aliases: ["execute"],
	description: "Выполнение JS-кода",
	usage: "<JS-код>",
    category: "BotOwner",
    humanizedCategory: "Разработка"
};

module.exports.execute = ({ client, message, args }) => {
    const code = args.join(" ");
    if(!code) return;
    
    try {
        const evaled = eval(code);
        message.channel.send(evaled, { code: "js" });
    } catch(e) {
        message.channel.send(e.stack, { code: "js" });
    }
};
