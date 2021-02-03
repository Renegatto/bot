module.exports = {
    name: "work",
    timeout: 1000 * 60 * 60 * 6,
    use: "work - Работа. Можно использовать раз в 6 часов",
    async run(client, msg, db, color, cmds) {
        let money = Math.round(Math.random() * 200 + 50);
        msg.channel.send({
            embed: {
                "title": `Команда [${this.name}]`,
                "description": `Вы заработали ${money} coins`,
                "footer": {
                    "text": `Запросил ${msg.author.tag}`,
                    "icon_url": msg.author.avatarURL()
                },
                "color": color
            }
        });
        await require("../zapolnit.js")(msg.author.id, db);
        await db.set(msg.author.id, "money", db.get(msg.author.id, "money") + money);
    }
}