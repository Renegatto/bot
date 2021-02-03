module.exports = {
    name: "avatar",
    use: "avatar [user ping] - бот отправит аватарку пользователя",
    async run(client, msg, db, color, cmds) {
        let user = msg.mentions.members.first();
        if (user) {
            msg.channel.send(user.user.displayAvatarURL({ size: 2048 }));
        } else {
            msg.channel.send(
                {
                    embed: {
                        "title": `Команда [${this.name}]`,
                        "description": "Пользователь не найден",
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