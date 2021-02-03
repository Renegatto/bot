module.exports = {
    name: "setShop",
    use: 'setShop [{"roleId":"[сюда айди роли]", "price":"[Сюда цену]", "name":"[сюда назв роли]"}]',
    canUse: [
        "801888924963962940", // Creator
        "801884872515256361" // Developer
    ],
    async run(client, msg, db, color, cmds) {
        let jsonShop = msg.content.split(" ");
        jsonShop.shift();
        jsonShop = jsonShop.join(" ");
        await db.set("config", "shop", JSON.parse(jsonShop));
        msg.channel.send({
            embed: {
                "description": "Успешно",
                "footer": {
                    "text": `Запросил ${msg.author.tag}`,
                    "icon_url": msg.author.avatarURL()
                },
                "color": color
            }
        });
    }
}