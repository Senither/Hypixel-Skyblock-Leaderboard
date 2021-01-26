import LandingPage from '@/views/LandingPage'
import Requirements from '@/views/Requirements'

import ListGuilds from '@/views/guilds/ListGuilds'
import ShowGuild from '@/views/guilds/ShowGuild'
import CompareGuilds from '@/views/guilds/CompareGuilds'

import ListPlayers from '@/views/players/ListPlayers'
import ShowPlayer from '@/views/players/ShowPlayer'

import ShowPlayerHistory from '@/views/history/ShowPlayerHistory'
import ShowGuildHistory from '@/views/history/ShowGuildHistory'

export default [
  {
    path: '/',
    name: 'landing-page',
    component: LandingPage,
  },
  {
    path: '/new-requirements',
    name: 'new-requirements',
    component: Requirements,
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
    path: '/players',
    name: 'players',
    component: ListPlayers,
  },
  {
    path: '/players/:uuid',
    name: 'players.show',
    component: ShowPlayer,
  },
  {
    path: '/history/player/:uuid',
    name: 'history.player',
    component: ShowPlayerHistory,
  },
  {
    path: '/history/guild/:id',
    name: 'history.guild',
    component: ShowGuildHistory,
  },
  {
    path: '/*',
    name: 'not-found',
    redirect: '/',
  },
]
