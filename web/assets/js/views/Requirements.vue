<template>
  <div>
    <section class="hero has-text-centered has-no-background">
      <div class="hero-body">
        <div class="container">
          <h1 class="title is-1">New Requirements</h1>
          <h2 class="subtitle">
            The requirements to join the leaderboard will be raised on the
            <u>26th of February</u>!
          </h2>
          <p class="box">
            All guilds applying to be on the leaderboard must meet the new
            requirements from the 26th, and guilds already on the leaderboard
            must meet the new stay requirements.
            <br />This is done in response to the growing amount of guilds on
            the leaderboard, and to try to make the leaderboard more of what it
            was actually supposed to be originally, a leaderboard of some of the
            "top guilds" in the game, this change should also help remove some
            of the inactive guilds from the leaderboard.
          </p>

          <br />

          <router-link :to="{ name: 'landing-page' }" class="button">
            <span class="icon is-small">
              <i class="fas fa-arrow-alt-circle-left"></i>
            </span>
            <span>Return to welcome notes</span>
          </router-link>
        </div>
      </div>
    </section>

    <div class="columns">
      <div class="column">
        <div class="box">
          <h3 class="title is-4 has-text-centered">Join Requirements</h3>
          <table class="table is-striped is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th class="has-text-left">Type</th>
                <th class="has-text-left">Old requirement</th>
                <th class="has-text-left"></th>
                <th class="has-text-right">New requirement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Skills</td>
                <td>30</td>
                <td><arrow /></td>
                <td class="has-text-right">35</td>
              </tr>
              <tr>
                <td>Slayers</td>
                <td>250K</td>
                <td><arrow /></td>
                <td class="has-text-right">500K</td>
              </tr>
              <tr>
                <td>Catacombs</td>
                <td>15</td>
                <td><arrow /></td>
                <td class="has-text-right">20</td>
              </tr>
              <tr>
                <td>Members</td>
                <td>35</td>
                <td><arrow /></td>
                <td class="has-text-right">50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="column">
        <div class="box">
          <h3 class="title is-4 has-text-centered">Stay Requirements</h3>
          <table class="table is-striped is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th class="has-text-left">Type</th>
                <th class="has-text-left">Old requirement</th>
                <th class="has-text-left"></th>
                <th class="has-text-right">New requirement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Skills</td>
                <td>25</td>
                <td><arrow /></td>
                <td class="has-text-right">30</td>
              </tr>
              <tr>
                <td>Slayers</td>
                <td>250K</td>
                <td><arrow /></td>
                <td class="has-text-right">250K</td>
              </tr>
              <tr>
                <td>Catacombs</td>
                <td>12.5</td>
                <td><arrow /></td>
                <td class="has-text-right">15</td>
              </tr>
              <tr>
                <td>Members</td>
                <td>25</td>
                <td><arrow /></td>
                <td class="has-text-right">35</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Arrow from '@components/Arrow'

export default {
  components: {
    Arrow,
  },
}
</script>
