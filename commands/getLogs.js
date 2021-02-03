module.exports = {
    name: "getLogs",
    use: "getLogs - отправка логов выполненных команд",
    canUse: [
        "801888924963962940", // Creator
        "801884872515256361" // Developer
    ],
    async run(client, msg, db, color, cmds) {
        msg.channel.send({ files: ["./db/logs.json"] });
    }
}