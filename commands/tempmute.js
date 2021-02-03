const naibPositionRole = require("../naibPositionRole.js");
const stringToTime = require("../stringToTime.js");
global.TempMutedUsers = new Map();
module.exports = {
    name: "tempmute",
    use: "tempmute [user ping] 0d 0h 0m 0s | [reason] - мут на время",
    canUse: [
        "801888924963962940", // Creator
        "801889835370414131", // Moderator
        "801884872515256361" // Developer
    ],
    async run(client, msg, db, color, cmds) {
        msg.delete();
        let mutedRole = msg.guild.roles.cache.get(db.get("roles", "muted"));
        let pricina = msg.content.split("|").slice(1).join("|");
        let time = msg.content.split("|")[0].split(" ").slice(2).join(" ");
        let logs = msg.guild.channels.cache.get(db.get("channels", "logs"));
        let user = msg.mentions.members.first();
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

        if (user._roles.includes(mutedRole.id)) {
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
                    "description": "Пользователь " + user.user.tag + " был замьючен модератором " + msg.author.tag + "\nНа " + require("../msToTime.js")(stringToTime(time)) + "\n По причине: " + (pricina || "Не указана"),
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
                    "description": "Вы были замьючены на сервере **Eternal Solitude** модератором " + msg.author.tag + "\nНа " + require("../msToTime.js")(stringToTime(time)) + "\n По причине: " + (pricina || "Не указана"),
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            }).then(async e => {
                user.roles.add(mutedRole);
                await db.set(user.id, "whenEndMuteUser", Date.now() + stringToTime(time));
                TempMutedUsers.set(user.id, setTimeout(async () => {
                    user.roles.remove(mutedRole);
                    await db.set(user.id, "whenEndMuteUser", undefined);
                }, stringToTime(time)));
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