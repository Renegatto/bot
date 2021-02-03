let Discord = require("discord.js");
module.exports = {
    name: "shop",
    use: 'shop [number] - выдаст список товаров',
    async run(client, msg, db, color, cmds) {
        let shop = db.get("config", "shop");
        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(`Команда [${this.name}]`);

        let countPages = Math.round((shop.length - 1) / 10);
        let thisPage = msg.content.split(" ")[1] || 1;

        thisPage--;

        shop = shop.slice(thisPage * 10);
        shop.length = 10;
        shop = shop.filter(x => x);

        if (shop.length === 0 || thisPage + 1 <= 0) {
            embed.addField("Упс", "Тут ничего нет!");
            return msg.channel.send(embed);
        }
        shop.forEach((e, i) => {
            let role = msg.guild.roles.cache.find(role => role.id === e.roleId);
            embed.addField("Роль №" + (thisPage * 10 + i + 1) + ":", `Название: ${role.name}\nid: ${e.roleId}\nЦена: ${e.price}`, false);
        });
        embed.addField("Cтраница", `${thisPage === 0 ? 1 : thisPage + 1}/${countPages + 1}`, false);
        if ((thisPage === 0 ? 1 : thisPage + 1) < (countPages + 1))
            embed.addField(`Следующая страница ${db.get("config", "prefix")}shop ${thisPage + 2}`, "___", false);
        msg.channel.send(embed);
    }
}