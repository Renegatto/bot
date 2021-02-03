module.exports = {
    name: "unban",
    use: "unban [user id] - разбан пользователя",
    canUse: [
        "801888924963962940", // Creator
        "801889835370414131", // Moderator
        "801884872515256361" // Developer
    ],
    async run(client, msg, db, color, cmds) {
        let id = msg.content.split(" ")[1] && msg.content.split(" ")[1].trim();
        msg.delete();
        let logs = msg.guild.channels.cache.get(db.get("channels", "logs"));
        try {
            await msg.guild.members.unban(id);


            logs.send({
                embed: {
                    "title": `Команда [БАН]`,
                    "description": "Пользователь " + id + " был разбанен модератором " + msg.author.tag,
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            });
        } catch (e) {
            msg.channel.send({
                embed: {
                    "title": `Команда [БАН]`,
                    "description": "Пользователь не существует или он не забанен",
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            });
        }
    }
}