module.exports = {
    name: "prefix",
    use: "prefix [prefix] - смена префикса",
    canUse: [
        "801888924963962940", // Creator
        "801884872515256361" // Developer
    ],
    async run(client, msg, db, color, cmds) {
        let prefix = msg.content.split(" ")[1];
        if (prefix && prefix.trim()) {
            await db.set("config", "prefix", prefix);
            msg.channel.send({
                embed: {
                    "title": `Команда [${this.name}]`,
                    "description": "Префикс \"" + prefix + "\" был установлен",
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            });
        } else {
            msg.channel.send({
                embed: {
                    "title": `КИК`,
                    "description": "Введите префикс",
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            })
        }
        client.user.setPresence({
            status: 'online',
            activity: {
                type: 'PLAYING',
                name: prefix + 'help',
            },
        });
    }
}