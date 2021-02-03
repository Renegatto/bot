module.exports = async function (id, db) {
    let exist = db.tableExist(id);
    if (!exist) {
        await db.createTable(id);
        db.reloadData();
    }
    if (db.get(id, "messageCount") === undefined) {
        await db.set(id, "messageCount", 0);
    }
    if (db.get(id, "id") === undefined) {
        await db.set(id, "id", id)
    }
    if (db.get(id, "lvl") === undefined) {
        await db.set(id, "lvl", 0);
    }
    if (db.get(id, "exp") === undefined) {
        await db.set(id, "exp", 0);
    }
    if (db.get(id, "needExp") === undefined) {
        await db.set(id, "needExp", 100);
    }
    if (db.get(id, "allExp") === undefined) {
        await db.set(id, "allExp", 0);
    }
    if (db.get(id, "money") === undefined) {
        await db.set(id, "money", 0);
    }
    if (db.get(id, "voiceTime") === undefined) {
        await db.set(id, "voiceTime", 0);
    }
}