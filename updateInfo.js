module.exports = function (msg) {
    let count = msg.guild.members.cache.filter(e => !e.user.bot).size;
    return count;
}