const naibPositionRole = require("../naibPositionRole.js");
module.exports = {
    name: "mute",
    use: "mute [user ping] [reason] - мут навсегда",
    canUse: [
        "801888924963962940", // Creator
        "801889835370414131", // Moderator
        "801884872515256361" // Developer
    ],
    async run(client, msg, db, color, cmds) {
        msg.delete();
        let user = msg.mentions.members.first();
        let logs = msg.guild.channels.cache.get(db.get("channels", "logs"));
        let pricina = msg.content.split(" ").slice(2).join(" ");
        if (!user) {
            return msg.channel.send({
                embed: {
                    "title": `МУТ`,
                    "description": "Пользователь не найден",
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            });
        }
        if (user._roles.includes(db.get("roles", "muted"))) {
            return msg.channel.send({
                embed: {
                    "title": `РАЗМУТ`,
                    "description": "Пользователь уже замьючен",
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            });
        }
        if (naibPositionRole(msg.member).position > naibPositionRole(user).position) {
            logs.send({
                embed: {
                    "title": `Команда [${this.name}]`,
                    "description": "Пользователь " + user.user.tag + " был замьючен модератором " + msg.author.tag + "\n По причине: " + (pricina || "Не указана"),
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            });
            user.user.send({
                embed: {
                    "title": `МУТ`,
                    "description": "Вы были замьючены на сервере **Eternal Solitude** модератором " + msg.author.tag + "\n По причине: " + (pricina || "Не указана"),
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            }).then(x => {
                user.roles.add(db.get("roles", "muted"));
            });
        } else {
            msg.channel.send({
                embed: {
                    "title": `МУТ`,
                    "description": "Вы не можете замутить данного пользователя",
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