const naibPositionRole = require("../naibPositionRole.js");
module.exports = {
    name: "addReaction",
    use: 'addReaction {"channelId":"id", "messageId":"id", "roleId":"id","reactionName":"name", "reverse":"true", "ybrat":"true","dat":"false"}',
    canUse: [
        "801888924963962940", // Creator
        "801889835370414131", // Moderator
        "801884872515256361" // Developer
    ],
    async run(client, msg, db, color, cmds) {
        let args;
        try {
            args = JSON.parse(msg.content.split(" ").slice(1).join(" ").trim())
        } catch (e) {
            return msg.channel.send("Invalid json");
        }

        let { channelId, messageId, roleId, reactionName, reverse, ybrat, dat } = args;

        let rolePosition = msg.guild.roles.cache.get(roleId).position;
        let userRolePosition = naibPositionRole(msg.member).position;
        console.log(rolePosition, userRolePosition)
        if (rolePosition > userRolePosition) {
            return msg.channel.send({
                embed: {
                    "description": "Вы не можете выставить роль выше своей",
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            });
        }
        if (!channelId || !messageId || !roleId || !reactionName || !reverse || !ybrat || !dat) {
            console.log(channelId, messageId, roleId, reactionName, reverse, ybrat, dat)
            return msg.channel.send({
                embed: {
                    "description": "Проверьте правильность введённых данных",
                    "footer": {
                        "text": `Запросил ${msg.author.tag}`,
                        "icon_url": msg.author.avatarURL()
                    },
                    "color": color
                }
            });
        }

        let reactions = db.get("messageReactions", messageId) || {};

        reactions[reactionName] = [roleId, {
            reverse: reverse === "true",
            ybrat: ybrat === "true",
            dat: dat === "true"
        }];

        msg.guild.channels.cache.get(channelId).messages.fetch(messageId)
            .then(mes => {
                mes.react(msg.guild.emojis.cache.find(e => e.name === reactionName));
            });
        await db.set("messageReactions", messageId, reactions);
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