module.exports = {
    name: "checkTimeMute",
    use: "checkTimeMute [user ping] - посмотреть на сколько замучен пользователь",
    async run(client, msg, db, color, cmds) {
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
        let time = db.get(user.id, "whenEndMuteUser");
        let isMute = "Пользователь не замучен";

        if (time - Date.now() > 0) {
            isMute = "До размута пользователя осталось " + require("../msToTime.js")(time - Date.now());
        } else if (user._roles.includes(db.get("roles", "muted"))) {
            isMute = "Пользователь замучен навсегда"
        }
        msg.channel.send({
            embed: {
                "title": `МУТ`,
                "description": isMute,
                "footer": {
                    "text": `Запросил ${msg.author.tag}`,
                    "icon_url": msg.author.avatarURL()
                },
                "color": color
            }
        });
    }
}