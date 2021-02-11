const higherRole = require("../naibPositionRole.js")

const default_embed = (tag,avatar,color) => (title, descr) => {
    embed: {
        "title": title,
        "description": descr,
        "footer": {
            "text": `Запросил ${tag}`,
            "icon_url": avatar()
        },
        "color": color
    }
};

module.exports = {
    name: "ban",
    use: "ban [user ping] [reason] - бан пользователя",
    canUse: [
        "801888924963962940", // Creator
        "801889835370414131", // Moderator
        "801884872515256361" // Developer
    ],
    async run(client, msg, db, color, cmds) {
        msg.delete();
        let logs = msg.guild.channels.cache.get("801898794064150609");
        let user = msg.mentions.members.first();
        let reason = msg.content.split(" ").shift().shift().join(" ") || "Не указана";
        
        let embed = default_embed(msg.author.tag, msg.author.avatarURL, color)
        
        if (!user) {msg.channel.send(embed(`БАН`,"Пользователь не найден"))
        } else {
            if (higherRole(msg.member).position > higherRole(user).position) {
                logs.send(embed(
                    `Команда [БАН]`,
                    `Пользователь ${user.user.tag} был забанен модератором ${msg.author.tag}\n По причине: ${reason}`
                ))
                user.send(embed(
                    `БАН`,
                    `Вы были забанены на сервере **Eternal Solitude** модератором ${msg.author.tag}\n По причине: ${reason}`
                )).then(x => {user.ban()})
                          
            } else {
                msg.channel.send(embed(`БАН`,"Вы не можете забанить данного пользователя"))
            }
        }
    }
}
