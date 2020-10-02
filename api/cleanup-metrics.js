'use strict';
process.title = 'Hypixel Skyblock Leaderboard Cleaner';

const Database = require('./src/database/database');
const prompt = require('prompt-sync')({ sigint: true });

console.log('This command can be used to cleanup the latest generated entries for');
console.log('a specefic guild, this will delete all the latest metrics, player metrics,');
console.log('and guild history entries for the given guild. This is helpful for');
console.log('cleaning up after Hypixels API if it had a breakdown(again).');
console.log('');
console.log('Enter the name of the guild that should be cleaned up:');

const guildName = prompt('> ');

const database = new Database;

database.runMigrations().then(async () => {
    const guild = await database.getClient().table('guilds').where('name', guildName).first();
    if (guild == undefined) {
        console.error(`\nNo guild with the name "${guildName}" where found!`);
        process.exit(1);
    }

    let dates = {
        '12 hours': 12 * 60 * 60 * 1000,
        '24 hours': 24 * 60 * 60 * 1000,
        '2 days': 24 * 60 * 60 * 1000 * 2,
        '3 days': 24 * 60 * 60 * 1000 * 3,
        '4 days': 24 * 60 * 60 * 1000 * 4,
        '5 days': 24 * 60 * 60 * 1000 * 5,
    };

    console.log('')
    console.log('How old should the data be to be cleaned up?');

    for (let [index, date] of Object.keys(dates).entries()) {
        console.log(`  ${index + 1}. ${date}`);
    }

    console.log('Enter the number representing the amount of time you wanna use:');
    const dateIndex = Number(prompt('> '));

    let dateKey = Object.keys(dates)[dateIndex - 1];
    let offset  = dates[dateKey];

    let date = new Date;
    date.setTime(date.getTime() - offset);

    console.log('');
    console.log(`Begining cleanup for ${guild.name}(${guild.uuid})`);
    console.log(`Any record older than ${date} will be deleted!`);

    let metricsDeleted = await database.getClient().table('metrics')
        .where('created_at', '>', date)
        .where('guild_id', guild.id)
        .delete();

    console.log(`Deleted ${metricsDeleted} guild metrics`);

    let playerMetricsDeleted = await database.getClient().table('player_metrics')
        .where('player_metrics.created_at', '>', date)
        .whereIn('uuid', function () {
            this.select('uuid')
                .from('players')
                .where('guild_id', guild.id);
        })
        .delete()

    console.log(`Deleted ${playerMetricsDeleted} player metrics`);

    let historyDeleted = await database.getClient().table('history')
        .where('created_at', '>', date)
        .where('guild_id', guild.id)
        .delete();

    console.log(`Deleted ${historyDeleted} guild history`);

    database.update('guilds', {
        last_updated_at: new Date(0),
    }, query => query.where('id', guild.id));

    console.log('Done!');

    setTimeout(() => process.exit(0), 500);
}).catch(error => console.error(error));
