module.exports = {
    name: "bal",
    use: "bal - Просмотр ваших сбережений",
    async run(client, msg, db, color, cmds) {
        msg.channel.send({
            embed: {
                "title": `Команда [${this.name}]`,
                "description": `У вас ${db.get(msg.author.id, "money")}$`,
                "footer": {
                    "text": `Запросил ${msg.author.tag}`,
                    "icon_url": msg.author.avatarURL()
                },
                "color": color
            }
        });
    }
}