const path = require('path');
const notifier = require('node-notifier');

function notify(title, body) {
    const icon = path.join(__dirname, 'icon.png');

    notifier.notify({
        title: title,
        message: body,
        icon: icon
    });
    console.log(`${title}, ${body}`);
}

module.exports = notify;
