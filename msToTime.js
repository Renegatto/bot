module.exports = module.exports = function (ms, arg) {
    let date = new Date(ms);
    if(arg === true){
    return `${Math.floor(ms / 60 / 60 / 1000 % 3600) || 0}h ${date.getUTCMinutes() || 0}m ${date.getUTCSeconds() || 0}s`;
    }
    return `${(Math.floor(ms / 60 / 60 / 1000 / 24 % 86400) || 0)}d ${date.getUTCHours() || 0}h ${date.getUTCMinutes() || 0}m ${date.getUTCSeconds() || 0}s`;
}