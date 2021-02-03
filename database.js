const fs = require("fs");
let d = fs.readdirSync(".");
if (!d.includes("db")) {
    fs.mkdirSync("db");
}
let data = {};
Object.prototype.filter = function (fn) {
    return Object.fromEntries(Object.entries(this).filter((a, b, c) => fn(a[1], a[0], c)));
}
Object.prototype.sort = function (fn) { // ВАЖНО! возвращается массив а не обьект, иначе как отсортировать обьект
    return Object.entries(this).sort((a, b) => fn(b[1].allExp, a[1].allExp))
        .map((x, y) => {
            return { ...x[1] }
        })
}
fs.readdirSync("db").forEach((a, b) => {
    data[a.slice(0, a.length - 5)] = JSON.parse(fs.readFileSync("db/" + a, "utf8"));
});
module.exports = {
    async createTable(name) {
        return new Promise((res, rej) => {
            fs.writeFile("db/" + name + ".json", "{}", res);
            data[name] = {};
        });
    },
    async reloadData() {
        fs.readdirSync("db").forEach((a, b) => {
            console.log(a);
            data[a.slice(0, a.length - 5)] = JSON.parse(fs.readFileSync("db/" + a, "utf8"));
        });
    },
    get(name, yacheika) {
        if (yacheika !== undefined) {
            return JSON.parse(JSON.stringify(data))[name][yacheika];
        }
        return JSON.parse(JSON.stringify(data))[name];
    },
    getAll() {
        return JSON.parse(JSON.stringify(data));
    },
    async set(name, yacheika, infa) {
        if (yacheika === undefined) {
            try {
                data[name] = infa;
            } catch (error) {
                return;
            }
        } else {
            data[name][yacheika] = infa;
        }
        return new Promise((res, rej) => {
            fs.writeFile("db/" + name + ".json", JSON.stringify(data[name]), res);
        })
    },
    tableExist(name) {
        return name in data;
    }
}