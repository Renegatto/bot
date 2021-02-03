const naibPositionRole = require("../naibPositionRole.js");
module.exports = {
    name: "unmute",
    use: "unmute [user ping] - размут",
    canUse: [
        "801888924963962940", // Creator
        "801889835370414131", // Moderator
        "801884872515256361" // Developer
    ],
    async run(client, msg, db, color, cmds) {
        msg.delete();
        let user = msg.mentions.members.first();
        let logs = msg.guild.channels.cache.get(db.get("channels", "logs"));
        let pricina = msg.content.split(" ").slice(2);
        pricina = pricina.join(" ");
        if (!user) {
            return msg.channel.send({
                embed: {
                    "title": `РАЗМУТ`,
                    "description": "Пользователь не найден",
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            })
        }
        if (!user._roles.includes(db.get("roles", "muted"))) {
            return msg.channel.send({
                embed: {
                    "title": `РАЗМУТ`,
                    "description": "Пользователь уже размьючен",
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            });
        }
        if (naibPositionRole(msg.member).position > naibPositionRole(user).position) {
            clearTimeout(TempMutedUsers.get(user.id));
            await db.set(user.id, "whenEndMuteUser", undefined);
            logs.send({
                embed: {
                    "title": `Команда [${this.name}]`,
                    "description": "Пользователь " + user.user.tag + " был размьючен модератором " + msg.author.tag,
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            });
            user.roles.remove(db.get("roles", "muted"));
        } else {
            msg.channel.send({
                embed: {
                    "title": `РАЗМУТ`,
                    "description": "Вы не можете размутить данного пользователя",
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