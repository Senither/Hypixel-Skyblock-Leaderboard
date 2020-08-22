
import LandingPage from '../views/LandingPage';

import ListGuilds from '../views/guilds/ListGuilds';
import ShowGuild from '../views/guilds/ShowGuild';
import CompareGuilds from '../views/guilds/CompareGuilds';

export default [
    {
        path: '/',
        name: 'landing-page',
        component: LandingPage,
    },
    {
        path: '/guilds',
        name: 'guilds',
        component: ListGuilds,
    },
    {
        path: '/guilds/:id',
        name: 'guilds.show',
        component: ShowGuild,
    },
    {
        path: '/compare-guilds/:ids?',
        name: 'guilds.compare',
        component: CompareGuilds,
    },
    {
        path: '/*',
        name: 'not-found',
        redirect: '/',
    }
];
