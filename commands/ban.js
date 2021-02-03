const naibPositionRole = require("../naibPositionRole.js")
module.exports = {
    name: "ban",
    use: "ban [user ping] [reason] - бан пользователя",
    canUse: [
        "801888924963962940", // Creator
        "801889835370414131", // Moderator
        "801884872515256361" // Developer
    ],
    async run(client, msg, db, color, cmds) {
        msg.delete();
        let logs = msg.guild.channels.cache.get("801898794064150609");
        let m = msg.content.split(" ")
        m = m[1];
        let user = msg.mentions.members.first();
        let isModer = null;
        let pricina = msg.content.split(" ");
        pricina.shift()
        pricina.shift()
        pricina = pricina.join(" ");
        if (!user) {
            msg.channel.send({
                embed: {
                    "title": `БАН`,
                    "description": "Пользователь не найден",
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            })
        } else {
            if (naibPositionRole(msg.member).position > naibPositionRole(user).position) {
                logs.send({
                    embed: {
                        "title": `Команда [БАН]`,
                        "description": "Пользователь " + user.user.tag + " был забанен модератором " + msg.author.tag + "\n По причине: " + (pricina || "Не указана"),
                        "footer": {
                            "text": `Запросил ${msg.author.tag}`,
                            "icon_url": msg.author.avatarURL()
                        },
                        "color": color
                    }
                });
                user.send({
                    embed: {
                        "title": `БАН`,
                        "description": "Вы были забанены на сервере **Eternal Solitude** модератором " + msg.author.tag + "\n По причине: " + (pricina || "Не указана"),
                        "footer": {
                            "text": `Запросил ${msg.author.tag}`,
                            "icon_url": msg.author.avatarURL()
                        },
                        "color": color
                    }
                }).then(x => {
                    user.ban();
                });
            } else {
                msg.channel.send({
                    embed: {
                        "title": `БАН`,
                        "description": "Вы не можете забанить данного пользователя",
                        "footer": {
                            "text": `Запросил ${msg.author.tag}`,
                            "icon_url": msg.author.avatarURL()
                        },
                        "color": color
                    }
                });
            }
        }
    }
}