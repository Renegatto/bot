module.exports = {
    name: "clearLogs",
    use: "clearLogs - очистка логов",
    canUse: [
        "801888924963962940", // Creator
        "801884872515256361" // Developer
    ],
    async run(client, msg, db, color, cmds) {
        await db.set("logs", undefined, [msg.author.tag + " : " + msg.content]);
        msg.channel.send("Логи очищены");
    }
}