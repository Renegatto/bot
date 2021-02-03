module.exports = {
    name: "removeReaction",
    use: 'removeReaction messageId | reactionName',
    canUse: [
        "801888924963962940", // Creator
        "801889835370414131", // Moderator
        "801884872515256361" // Developer
    ],
    async run(client, msg, db, color, cmds) {
        let messageId, reactionName;
        try {
            messageId = msg.content.split("|")[0].split(" ")[1].trim();
            reactionName = msg.content.split("|")[1].trim();
        } catch (e) {
            msg.channel.send({
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
        let rec = db.get("messageReactions", messageId);
        rec[reactionName] = undefined;
        await db.set("messageReactions", messageId, rec);
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