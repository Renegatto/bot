module.exports = {
    name: "report",
    use: "report [message] - отправить репорт на баг/человека либо же предложение по улучшению сервера",
    async run(client, msg, db, color, cmds) {
        let reportMessage = msg.content.split(" ").slice(1).join(" ");
        let reportChannel = msg.guild.channels.cache.get(db.get("channels", "reports"));
        if (!reportMessage) {
            return msg.channel.send({
                embed: {
                    "title": `Команда ${this.name}`,
                    "description": "Введите сообщение",
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            });
        }
        msg.channel.send({
            embed: {
                "title": `Команда ${this.name}`,
                "description": "Ваше предложение будет рассмотрена модераторами",
                "footer": {
                    "text": `Запросил ${msg.author.tag}`,
                    "icon_url": msg.author.avatarURL()
                },
                "color": color
            }
        });
        reportChannel.send({
            embed: {
                "title": "Report!!",
                "description": reportMessage,
                "footer": {
                    "text": `Отправил ${msg.author.tag}`,
                    "icon_url": msg.author.avatarURL()
                },
                "color": color
            }
        });
    }
}