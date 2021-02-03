module.exports = async function (db) {
    let color = db.get("config", "colors");
    let count = new Date().getDay();
    return color[count];
}