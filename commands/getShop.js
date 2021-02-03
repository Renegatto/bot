module.exports = {
    name: "getShop",
    use: "getShop Вернёт данные магазина для изменения товаров",
    canUse: [
        "801888924963962940", // Creator
        "801884872515256361" // Developer
    ],
    async run(client, msg, db, color, cmds) {
        msg.channel.send({
            embed: {
                "description": JSON.stringify(db.get("config", "shop")),
                "footer": {
                    "text": `Запросил ${msg.author.tag}`,
                    "icon_url": msg.author.avatarURL()
                },
                "color": color
            }
        })
    }
}