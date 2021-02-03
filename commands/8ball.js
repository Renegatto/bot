module.exports = {
    name: "8ball",
    use: "8ball я умный? - бот ответит на ваш вопрос",
    async run(client, msg, db, color, cmds) {
        let words = [
            "может быть",
            "возможно",
            "да, само собой",
            "разумеется",
            "конечно",
            "нет",
            "да",
            "никогда",
            "ни за что",
            "это невозможно",
            "хмм, не думаю"
        ];
        msg.channel.send({
            embed: {
                "description": "Шар судьбы говорит: " + words[Math.floor(Math.random() * words.length)],
                "footer": {
                    "text": `Запросил ${msg.author.tag}`,
                    "icon_url": msg.author.avatarURL()
                },
                "color": color
            }
        });
    }
}