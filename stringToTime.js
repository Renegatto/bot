module.exports = function (str, arg) {
    let spStr = str.split(" ");
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let ms = 0;
    let seconds = 0;

    spStr.forEach(e => {
        let number = +e.slice(0, e.length - 1);
        if (isNaN(number)) return;
        if (e.endsWith("d") && !arg) {
            days += number;
        }
        if (e.endsWith("h")) {
            hours += number;
        }
        if (e.endsWith("m")) {
            minutes += number;
        }
        if (e.endsWith("s")) {
            seconds += number;
        }
    });

    ms = (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);
    return ms;
}