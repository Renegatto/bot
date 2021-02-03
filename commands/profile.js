module.exports = {
    name: "profile",
    use: "profile [user ping] - выдаст профиль пользователя",
    async run(client, msg, db, color, cmds) {
        let week = {
            "Mon": "Понедельник",
            "Tue": "Вторник",
            "Wed": "Среда",
            "Thu": "Четверг",
            "Fri": "Пятница",
            "Sat": "Суббота",
            "Sun": "Воскресенье",
        };
        let months = {
            "Jan": "Января",
            "Feb": "Февраля",
            "Mar": "Марта",
            "Apr": "Апреля",
            "May": "Мая",
            "Jun": "Июня",
            "Jul": "Июля",
            "Aug": "Августа",
            "Sep": "Сентября",
            "Oct": "Октября",
            "Nov": "Ноября",
            "Dec": "Декабря"
        }
        let user = msg.mentions.members.first();
        if (!user) {
            user = msg.guild.members.cache.get(msg.author.id);
        }
        await require("../zapolnit.js")(user.id, db);


        let voiceTime = db.get(user.id, "voiceTime");

        if (db.get(user.id, "voiceConnectTime")) {
            voiceTime = Date.now() - db.get(user.id, "voiceConnectTime") + db.get(user.id, "voiceTime");
        }



        let createdAt = user.user.createdAt.toString();
        console.log(createdAt)
        let time = week[createdAt.split(" ")[0].trim()] + " " + createdAt.split(" ")[2].trim() + " " + months[createdAt.split(" ")[1].trim()] + " в " + createdAt.split(" ")[4].trim() + " " + createdAt.split(" ")[3].trim() + "г"
        let info = await db.get(user.id);
        msg.channel.send({
            embed: {
                "image": { "url": user.user.avatarURL() },
                "title": "Профиль " + user.user.tag,
                "fields": [
                    {
                        "name": "Дата регистрации",
                        "value": time,
                        "inline": false
                    },
                    {
                        "name": "Время в войсе",
                        "value": require("../msToTime.js")(voiceTime),
                        "inline": false
                    },
                    {
                        "name": "Отправлено сообщений",
                        "value": info["messageCount"] || 0,
                        "inline": false
                    },
                    {
                        "name": "Ролей",
                        "value": user._roles.length,
                        "inline": false
                    },
                    {
                        "name": "Лвл",
                        "value": (info["lvl"] || 0),
                        "inline": false
                    },
                    {
                        "name": "Опыт",
                        "value": (info["exp"] || 0) + "/" + (info["needExp"] || 100) + "\nЗаработанный за всё время: " + (info["allExp"] || 0),
                        "inline": false
                    },
                    {
                        "name": "Деньги",
                        "value": (info["money"] || 0),
                        "inline": false
                    },
                ],
                "footer": {
                    "text": `Запросил ${msg.author.tag}`,
                    "icon_url": msg.author.avatarURL()
                },
                "color": color
            }
        })
    }
}