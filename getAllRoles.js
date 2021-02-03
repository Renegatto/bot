module.exports = function (msg) {
    let res = [];
    msg.guild.roles.cache.forEach(e => {
        res.push(e.id)
    });
    return res;
}