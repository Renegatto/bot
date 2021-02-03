const stringToTime = require("../stringToTime.js");
module.exports = {
    name: "slowmode",
    use: "slowmode 0h 0m 0s - установка задержки сообщений для текущего канала",
    canUse: [
        "801888924963962940", // Creator
        "801889835370414131", // Moderator
        "801884872515256361" // Developer
    ],
    async run(client, msg, db, color, cmds) {
        let count = msg.content.split(" ").slice(1).join(" ");
        if (count) {
            msg.channel.setRateLimitPerUser(stringToTime(count, true) / 1000, "reason");
            msg.channel.send({
                embed: {
                    "title": `Команда [${this.name}]`,
                    "description": "slowmode для этого канала установлен на " + require("../msToTime")(stringToTime(count, true), true),
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            })
        } else {
            msg.channel.send({
                embed: {
                    "title": `Команда [${this.name}]`,
                    "description": "Укажите время в формате 0h 0m 0s",
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            })
        }
    }
}