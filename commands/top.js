const Discord = require("discord.js");
module.exports = {
    name: "top",
    use: "top - топ по лвлам",
    async run(client, msg, db, color, cmds) {
        let info = db.getAll();
        info = info.filter(x => x.allExp);
        info = info.sort((a, b) => a - b);
        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(`Топ участников`);
        info.length = 5;
        info = info.filter(x => x);
        info.forEach((e, i) => {
            let user = msg.guild.members.cache.get(e.id);
            if ((user && user.user && user.user.tag)) {
                embed.addField((i + 1) + " Место " + user.user.tag, "\nlvl: " + e.lvl + "\nexp: " + e.exp + "/" + e.needExp + "\nid: " + e.id, false);
            } else {
                embed.addField((i + 1) + " Место", "ping: <@" + e.id + ">" + "\nlvl: " + e.lvl + "\nexp: " + e.exp + "/" + e.needExp + "\nid: " + e.id, false);
            }
        })
        msg.channel.send(embed);
    }
}