module.exports = {
    name: "buy",
    use: "buy [number role in shop] - покупка роли в магазине",
    async run(client, msg, db, color, cmds) {
        let count = +msg.content.split(" ")[1] - 1;
        if (isNaN(count)) {
            return msg.channel.send({
                embed: {
                    "title": `Команда [${this.name}]`,
                    "description": "Введите номер роли для покупки",
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            });
        }
        let user = db.get(msg.author.id);
        let roles = db.get("config", "shop");
        if (roles[count] === undefined) {
            return msg.channel.send({
                embed: {
                    "title": `Команда [${this.name}]`,
                    "description": "Такого товара нет в наличии",
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            });
        }
        if (user.money >= +roles[count].price) {
            if (msg.guild.members.cache.get(msg.author.id)._roles.includes(roles[count].roleId)) {
                return msg.channel.send({
                    embed: {
                        "title": `Команда [${this.name}]`,
                        "description": "Эта роль у вас уже есть",
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
                    "title": `Команда [${this.name}]`,
                    "description": "Вы купили роль",
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            });
            await db.set(msg.author.id, "money", user.money - roles[count].price);
            msg.guild.members.cache.get(msg.author.id).roles.add(msg.guild.roles.cache.get(roles[count].roleId));
        } else {
            msg.channel.send({
                embed: {
                    "title": `Команда [${this.name}]`,
                    "description": "У вас не хватает денег",
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