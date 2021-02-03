module.exports = {
    name: "say",
    use: "say [message or embed] - бот начнёт говорить)",
    canUse: [
        "801888924963962940", // Creator
        "801889835370414131", // Moderator
        "801884872515256361" // Developer
    ],
    async run(client, msg, db, color, cmds) {
        let message = msg.content.split(" ");
        message.shift();
        message = message.join(" ");
        msg.delete();
        if (!message.trim()) {
            msg.channel.send(
                {
                    embed: {
                        "title": `Команда [${this.name}]`,
                        "description": "Введите текст",
                        "footer": {
                            "text": `Запросил ${msg.author.tag}`,
                            "icon_url": msg.author.avatarURL()
                        },
                        "color": color
                    }
                }
            );
        } else {
            try {
                let obj = JSON.parse(message.trim());
                let url = obj.image;
                obj.image = {};
                obj.image.url = url;
                msg.channel.send({ embed: obj });
            } catch (e) {
                msg.channel.send(message.trim());
            }
        }
    }
}