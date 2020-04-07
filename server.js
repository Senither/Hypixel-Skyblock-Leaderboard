'use strict';
process.title = 'Hypixel Skyblock Leaderboard Generator';

const app = require('./src/application');

app.bootstrap().then(() => {
    app.register();
    app.connect();
}).catch(err => console.error(err));
