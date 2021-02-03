module.exports = function (a, b) {
    let result = false;
    b.forEach(e => {
        if (a.includes(e)) result = true;
    });
    return result;
}