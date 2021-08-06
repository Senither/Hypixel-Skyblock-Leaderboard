module.exports = {
  /**
   * This is the hostname and port that the API server is running on,
   * you can use the IP of the server the API is hosted on combined
   * with the port defined in the config for the API.
   *
   * @type {String}
   */
  apiUrl: 'https://hypixel-app-api.senither.com/leaderboard',

  /**
   * This is the announcement that should be displayed to everyone
   * visiting the site, when enabled a blue notification will be
   * shown at the top of every page on the site with the given
   * title and message, changes to the announcement will only
   * take affect after the assets has been recompiled.
   *
   * @type {Object}
   */
  announcement: {

    /**
     * Determines if the announcement should be displayed.
     *
     * @type {Boolean}
     */
    enabled: false,

    /**
     * The title of the announcement.
     *
     * @type {String}
     */
    title: 'Announcement!',

    /**
     * The title of the announcement.
     *
     * @type {String}
     */
    message: 'This is the announcement that should be displayed to everyone visiting the site.',
  },
}
