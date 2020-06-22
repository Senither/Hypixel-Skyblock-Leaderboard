
import ListGuilds from '../views/guilds/ListGuilds';
import ShowGuild from '../views/guilds/ShowGuild';

export default [
    {
        path: '/',
        name: 'guilds',
        component: ListGuilds,
    },
    {
        path: '/guild/:id',
        name: 'guilds.show',
        component: ShowGuild,
    }
];
