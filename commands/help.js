const Discord = require("discord.js");
const mergeInclude = require("../mergeInclude.js");
module.exports = {
    name: "help",
    use: "help [number] - список команд",
    async run(client, msg, db, color, cmds) {
        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(`Команда [${this.name}]`);
        let cmds2 = [];
        cmds.forEach(e => {
            cmds2.push(e);
        });

        cmds2 = cmds2.filter(e => {
            if (e.use) {
                return mergeInclude(msg.member._roles, e.canUse || []) || e.canUse === undefined || (e.canUse && e.canUse.length === 0);
            }
        })
        // .filter(x => x);



        let countPages = Math.floor((cmds2.length - 1) / 10);
        let thisPage = msg.content.split(" ")[1] || 1;

        thisPage--;

        cmds2 = cmds2.slice(thisPage * 10);
        cmds2.length = 10;
        cmds2 = cmds2.filter(x => x);

        if (cmds2.length === 0 || thisPage + 1 <= 0) {
            embed.addField("Упс", "Тут ничего нет!");
            return msg.channel.send(embed);
        }
        cmds2.forEach((e, i) => {
            embed.addField(e.name, db.get("config", "prefix") + e.use, false);
        })
        if ((thisPage === 0 ? 1 : thisPage + 1) === 1) {
            embed.addField("Упоминание бота", "Упоминание бота - скажет префикс", false)
        }
        embed.addField("Cтраница", `${thisPage === 0 ? 1 : thisPage + 1}/${countPages + 1}`, false);
        if ((thisPage === 0 ? 1 : thisPage + 1) < (countPages + 1))
            embed.addField(`Следующая страница ${db.get("config", "prefix")}help ${thisPage + 2}`, "___", false);
        msg.channel.send(embed);
    }
}