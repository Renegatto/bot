module.exports = function (member) {
    let res = null;
    member.roles.cache.forEach(e => {
        if (res === null || e.position > res.position) res = e;
    });
    return res;
}