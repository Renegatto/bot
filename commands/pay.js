module.exports = {
    name: "pay",
    use: "pay [user ping] [count] - перевод денег другому пользователю",
    async run(client, msg, db, color, cmds) {
        let userId = msg.mentions.members.first();
        let authorId = msg.author.id;
        let author = db.get(authorId);
        let count = +(+msg.content.split(" ")[2]).toFixed(0);
        if (!userId) {
            return msg.channel.send({
                embed: {
                    "title": `Команда [${this.name}]`,
                    "description": `Укажите пользователя`,
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            });
        }

        if (isNaN(count)) {
            return msg.channel.send({
                embed: {
                    "title": `Команда [${this.name}]`,
                    "description": `Введите число`,
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            });
        }

        if (count < 1) {
            return msg.channel.send({
                embed: {
                    "title": `Команда [${this.name}]`,
                    "description": `Вы не можете отправлять число меньше одного`,
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            });
        }
        if (userId.user.bot) {
            return msg.channel.send({
                embed: {
                    "title": `Команда [${this.name}]`,
                    "description": `Бот не нуждается в ваших деньгах(`,
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            });
        }
        userId = userId.id;
        if (userId === authorId) {
            return msg.channel.send({
                embed: {
                    "title": `Команда [${this.name}]`,
                    "description": `Вы не можете переслать деньги самому себе`,
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            });
        }
        let user = db.get(userId);
        if (author.money >= count) {
            await db.set(authorId, "money", author.money - count);
            await db.set(userId, "money", (user.money || 0) + count);
            msg.channel.send({
                embed: {
                    "title": `Команда [${this.name}]`,
                    "description": `Вы отправили ${count} coins пользователю ` + msg.mentions.members.first().user.tag,
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
                    "description": `У вас не хватает денег`,
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