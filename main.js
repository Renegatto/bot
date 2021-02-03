const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const fs = require("fs");
const db = require("./database.js");
const msToTime = require('./msToTime.js');
const secToTime = require("./msToTime.js");
const mergeInclude = require("./mergeInclude.js");
let cmds = new Map();
let channelsMessageStack = new Map();
let stackMessages = 0;
cmds = new Map();

client.on("messageDelete", async (message, channel) => {
    if (db.get("messageReactions", message.id)) {
        await db.set("messageReactions", message.id, undefined);
    }
});

client.on('messageReactionRemove', async (reaction, user) => {
    let reactionName = reaction.message.guild.emojis.cache.get(reaction.emoji.id) && reaction.message.guild.emojis.cache.get(reaction.emoji.id).name;
    let reac = db.get("messageReactions", reaction.message.id);
    let member = reaction.message.guild.members.cache.get(user.id);
    if (!reac || member.user.bot || !reac[reactionName]) return;
    let [role, args] = reac[reactionName];
    if (args.reverse && args.dat) {
        return member.roles.add(role);
    }
    if (!args.reverse && args.ybrat) {
        return member.roles.remove(role);
    }
});

client.on("voiceStateUpdate", async (oldState, newState) => {
    await require("./zapolnit.js")(newState.member.user.id, db);

    if (!newState.channel) {
        if (db.get(newState.member.id, "voiceConnectTime")) {
            await db.set(newState.member.id, "voiceTime", Date.now() - db.get(newState.member.id, "voiceConnectTime") + db.get(newState.member.id, "voiceTime"));
            await db.set(newState.member.id, "voiceConnectTime", undefined);
        }
        return;
    }

    let canSpeak = newState.channel.permissionsFor(newState.member).has("SPEAK");
    let muted = newState.selfMute;
    if (muted || !canSpeak) {
        if (db.get(newState.member.id, "voiceConnectTime")) {
            await db.set(newState.member.id, "voiceTime", Date.now() - db.get(newState.member.id, "voiceConnectTime") + db.get(newState.member.id, "voiceTime"));
            await db.set(newState.member.id, "voiceConnectTime", undefined);
        }
    } else {
        await db.set(newState.member.id, "voiceConnectTime", Date.now());
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    let reactionName = reaction.message.guild.emojis.cache.get(reaction.emoji.id) && reaction.message.guild.emojis.cache.get(reaction.emoji.id).name;

    let member = reaction.message.guild.members.cache.get(user.id);
    let reac = db.get("messageReactions", reaction.message.id);
    if (!reac || member.user.bot || !reac[reactionName]) return;
    let [role, args] = reac[reactionName];
    if (args.reverse && args.ybrat) {
        return member.roles.remove(role);
    }
    if (!args.reverse && args.dat) {
        return member.roles.add(role);
    }
});

fs.readdirSync("commands").forEach(e => {
    let obj = require("./commands/" + e);
    console.log(obj);
    cmds.set(obj.name, obj);
});

client.on('ready', async () => {
    let muted = db.getAll();
    let guild = client.guilds.cache.first();
    let mutedRole = guild.roles.cache.get(db.get("roles", "muted"));

    let connectedUsers = db.getAll().filter(e => e.voiceConnectTime);
    for (let e in connectedUsers) {
        if (connectedUsers[e].id) {
            await db.set(connectedUsers[e].id, "voiceConnectTime", undefined);
        }
    }


    client.guilds.cache.first().channels.cache.forEach(async e => {
        if (e.type === "voice") {
            e.members.forEach(async user => {
                let canSpeak = e.permissionsFor(user).has("SPEAK");
                let muted = user.voice.selfMute;
                if (muted || !canSpeak) {
                    if (db.get(user.id, "voiceConnectTime")) {
                        await db.set(user.id, "voiceTime", Date.now() - db.get(user.id, "voiceConnectTime") + db.get(user.id, "voiceTime"));
                        await db.set(user.id, "voiceConnectTime", undefined);
                    }
                } else {
                    await db.set(user.id, "voiceConnectTime", Date.now());
                }
            })
        }
    });

    Object.keys(muted).forEach(async e => {
        let us = muted[e];
        let date = Date.now();
        if (us && us.whenEndMuteUser !== undefined) {

            if (date - us.whenEndMuteUser < 0) {
                setInterval(async () => {
                    guild.members.cache.get(us.id).roles.remove(mutedRole);
                    await db.set(us.id, "whenEndMuteUser", undefined);
                }, date - us.whenEndMuteUser);
            } else {
                guild.members.cache.get(us.id).roles.remove(mutedRole);
                await db.set(us.id, "whenEndMuteUser", undefined);
            }
        }
    });
    setInterval(() => {
        channelsMessageStack.forEach((a, b) => {
            channelsMessageStack.set(b, 0);
        })
    }, 5000);
    client.user.setPresence({
        status: 'online',
        activity: {
            type: 'PLAYING',
            name: db.get("config", "prefix") + 'help',
        },
    });

    client.guilds.cache.first().members.cache.forEach(async e => {
        if (db.tableExist(e.id)) {
            await db.set(e.id, "savedRoles", e._roles);
        }
    });
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("guildMemberAdd", async (message, member) => {
    let newbies = message.guild.channels.cache.get(db.get("channels", "newbies"));
    let color = await require("./getColor.js")(db);
    let role = message.guild.roles.cache.get(db.get("roles", "member"));

    let role2 = message.guild.roles.cache.get(db.get("roles", "not-authorized"));

    let membr = message.guild.members.cache.get(message.user.id);
    let time = new Date().getHours() + ":" + new Date().getMinutes();
    let savedRoles = db.get(message.user.id, "savedRoles");
    if (!savedRoles || savedRoles.length !== 0) {
        membr.roles.add(savedRoles);
    } else {
        membr.roles.add([role, role2]);
    }
    newbies.send({
        embed: {
            // "title": `Новичёк!`,
            "description": "<@" + message.user.id + ">" + " добро пожаловать на сервер. Теперь нас **" + require("./updateInfo.js")(message) + "**",
            "color": color
        }
    })
});
client.on("guildMemberRemove", async (message, member) => {
    let newbies = message.guild.channels.cache.get(db.get("channels", "newbies"));
    let color = await require("./getColor.js")(db);
    let time = new Date().getHours() + ":" + new Date().getMinutes();
    newbies.send({
        embed: {
            // "title": `Прощай`,
            "description": "Пользователь <@" + message.user.id + ">" + ", покинул сервер и нас стало **" + require("./updateInfo.js")(message) + "**",
            "color": color
        }
    });
});
client.on("guildMemberUpdate", async (oldMember, newMember) => {
    if (JSON.stringify(oldMember._roles) !== JSON.stringify(newMember._roles)) {
        await db.set(newMember.id, "savedRoles", newMember._roles);
    }
});


client.on('message', async msg => {
    if (msg.author.bot) return;
    let prefix = db.get("config", "prefix");
    let cmd = cmds.get(msg.content.slice(prefix.length).split(" ")[0]);
    let stack = channelsMessageStack.get(msg.channel.id) + 1;
    channelsMessageStack
        .set(msg.channel.id, stack);
    let color = await require("./getColor.js")(db);
    if (stack >= 10) {
        channelsMessageStack.set(msg.channel.id, 0);
        msg.channel.setRateLimitPerUser(10, "reason");
        msg.channel.bulkDelete(stack)
            .then(x => {
                msg.channel.send({
                    embed: {
                        "title": `Что-то спам у вас тут да`,
                        "color": color
                    }
                })
            })
        return;
    }
    if (msg.content.trim() === "<@801876276952039456>" || msg.content.trim() === "<@!801876276952039456>") {
        return msg.channel.send({
            embed: {
                "description": "Префикс: \"" + prefix + "\"",
                "footer": {
                    "text": `Запросил ${msg.author.tag}`,
                    "icon_url": msg.author.avatarURL()
                },
                "color": color
            }
        });
    }
    let exist = db.tableExist(msg.author.id);
    let bots = msg.guild.channels.cache.get(db.get("channels", "bots"));
    await require("./zapolnit.js")(msg.author.id, db);
    if (msg.mentions.members.first()) {
        await require("./zapolnit.js")(msg.mentions.members.first().id, db);
    }
    if (!cmd && msg.channel.id === db.get("channels", "general")) {
        let info = db.get(msg.author.id);
        let rand = Math.round(Math.random() * 25 + 10);
        info["exp"] += rand;
        info["allExp"] += rand;
        info["messageCount"]++;
        if (info["exp"] >= info["needExp"]) {
            info["exp"] = info["exp"] - info["needExp"];
            info["needExp"] += 35;
            info["lvl"]++;
            let bots = msg.guild.channels.cache.get("");
            bots.send({
                embed: {
                    "description": "Молодец <@!" + msg.author.id + ">, ты достиг " + info["lvl"] + " лвл",
                    "color": color
                }
            });
        }
        await db.set(msg.author.id, undefined, info);
    }
    if (msg.content.startsWith(prefix)) {
        if (cmd && !mergeInclude(msg.member._roles, db.get("config", "canUseCMDinChat")) && msg.channel.id === "773983010844442704") {
            msg.delete();
            console.log(msg.author.tag + " пытался написать команду в чате " + msg.author.id)
            let logsConfig = db.get("logs");
            logsConfig.push(msg.author.tag + " пытался написать команду в чате " + msg.author.id);
            await db.set("logs", undefined, logsConfig);
            msg.author.send(
                {
                    embed: {
                        "title": `Команда [${cmd.name}]`,
                        "description": "Команды в главном чате использовать нельзя!",
                        "footer": {
                            "text": `Запросил ${msg.author.tag}`,
                            "icon_url": msg.author.avatarURL()
                        },
                        "color": color
                    }
                }
            );
            return;
        }
        if (cmd) {
            console.log("\n\n", msg.author.tag, "\n", msg.content, "\n\n");
            if (db.get("logs") === undefined) {
                await db.set("logs", undefined, []);
            }
            let logsConfig = db.get("logs");
            logsConfig.push(msg.author.tag + " : " + msg.content);
            await db.set("logs", logsConfig);
            if (cmd.canUse && !mergeInclude(msg.member._roles, cmd.canUse)) {
                msg.channel.send(
                    {
                        embed: {
                            "title": `Команда [${cmd.name}]`,
                            "description": "Недостаточно прав",
                            "footer": {
                                "text": `Запросил ${msg.author.tag}`,
                                "icon_url": msg.author.avatarURL()
                            },
                            "color": color
                        }
                    }
                );
                return;
            }

            if (cmd.timeout !== undefined && !mergeInclude(msg.member._roles, cmd.ignoreTimer || [])) {
                let userTime = +db.get(msg.author.id, cmd.name + "TimeStamp");
                let time = Date.now();
                if (isNaN(userTime)) {
                    await db.set(msg.author.id, cmd.name + "TimeStamp", Date.now() + cmd.timeout);
                    cmd.run(client, msg, db, color, cmds);
                } else {
                    if (userTime - time <= 0) {
                        cmd.run(client, msg, db, color, cmds);
                        await db.set(msg.author.id, cmd.name + "TimeStamp", Date.now() + cmd.timeout);
                    } else {
                        msg.channel.send(
                            {
                                embed: {
                                    "title": `Команда [${cmd.name}]`,
                                    "description": "На эту команду, установлено ограничение по скорости. Пожалуйста подождите " + msToTime(userTime - time) + " и повторите попытку",
                                    "footer": {
                                        "text": `Запросил ${msg.author.tag}`,
                                        "icon_url": msg.author.avatarURL()
                                    },
                                    "color": color
                                }
                            }
                        )
                    }
                }
                return;
            }

            cmd.run(client, msg, db, color, cmds);
        }

    }
});
client.login(require("./token.json").token);