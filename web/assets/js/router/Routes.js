
import ListGuilds from '../views/guilds/ListGuilds';
import ShowGuild from '../views/guilds/ShowGuild';
import CompareGuilds from '../views/guilds/CompareGuilds';

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
    },
    {
        path: '/compare-guilds/:ids?',
        name: 'guilds.compare',
        component: CompareGuilds,
    }
];
