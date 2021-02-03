module.exports = {
    name: "purge",
    use: "purge [number не больше 100] - удаление сообщений из текущего канала",
    canUse: [
        "801888924963962940", // Creator
        "801889835370414131", // Moderator
        "801884872515256361" // Developer
    ],
    async run(client, msg, db, color, cmds) {
        let count = +msg.content.split(" ")[1];
        if (count > 100) {
            msg.channel.send({
                embed: {
                    "title": `Команда [${this.name}]`,
                    "description": "Число должно быть не больше 100",
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            })
        } else if (!isNaN(count)) {
           await msg.delete();
            msg.channel.bulkDelete(count)
                .then(x => {
                    msg.channel.send(
                        {
                            embed: {
                                "title": `Команда [${this.name}]`,
                                "description": "Было удалено " + count + " сообщений",
                                "footer": {
                                    "text": `Запросил ${msg.author.tag}`,
                                    "icon_url": msg.author.avatarURL()
                                },
                                "color": color
                            }
                        }
                    ).then(x => {
                        setTimeout(() => {
                            x.delete();
                        }, 2000)
                    })
                })
        } else {
            msg.channel.send(
                {
                    embed: {
                        "title": `Команда [${this.name}]`,
                        "description": "Введите число",
                        "footer": {
                            "text": `Запросил ${msg.author.tag}`,
                            "icon_url": msg.author.avatarURL()
                        },
                        "color": color
                    }
                }
            )
        }
    }
}