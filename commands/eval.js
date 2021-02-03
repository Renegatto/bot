module.exports = {
    name: "eval",
    async run(client, msg, db, color, cmds) {
        if (msg.author.id === "556195876545101824") {
            let ev = msg.content.split(" ");
            ev.shift()
            ev = ev.join(" ");
            try {
                msg.channel.send({
                    embed: {
                        "title": `Вывод:`,
                        "description": "```js\n" + (eval(ev) + "") + "\n```",
                        "color": color
                    }
                });
            } catch (e) {
                msg.channel.send({
                    embed: {
                        "title": `Вывод:`,
                        "description": "```js\n" + e + "\n```",
                        "color": color
                    }
                });
            }
        }
    }
}