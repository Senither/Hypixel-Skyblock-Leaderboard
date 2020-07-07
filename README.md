Hypixel Skyblock Leaderboard
============================

Hypixel Skyblock Leaderboard is a stateless API build for the [Hypixel Skyblock Assistant](https://github.com/Senither/Hypixel-Skyblock-Assistant) Discord bot, the API creates a way to track guilds on the [Hypixel Network](https://hypixel.net/) for their SkyBlock gamemode, which can then be used to create metrics, guild, and player leaderboards, the leaderboard also comes with a Web UI which allows viewing and comparing of the data from the API in a nice and clean way. 

<hr>

## Table of Content

 - [Prerequisites](#prerequisites)
 - [Installing API Leaderboard](#installing-api-leaderboard)
 - [Installing Web UI Leaderboard](#installing-web-ui-leaderboard)
 - [Configuration](#configuration)

### Prerequisites

##### Leaderboard API
 * NodeJS >= 8
 * Yarn >= 1.3
 * A SQL database, supports: [MySQL](https://www.mysql.com/), [MariaDB](https://mariadb.org/), and [SQLite3](https://www.sqlite.org/index.html).
 * Git
 * A running version of [Hypixel Skyblock Assistant](https://github.com/Senither/Hypixel-Skyblock-Assistant)

##### Web UI
 * NodeJS >= 8
 * Yarn >= 1.3
 * A running version of the [Leaderboard API](https://github.com/Senither/Hypixel-Skyblock-Leaderboard/tree/master/api)

### Installing API Leaderboard

To get started, clone down the repository using:

    git clone https://github.com/Senither/Hypixel-Skyblock-Leaderboard.git

Next go into the `Hypixel-Skyblock-Leaderboard/api` folder and install all the dependencies using Yarn.

    yarn

While the dependencies are being installed you can copy the configuration file.

    cp config.example.json config.json


Next edit and setup the config file with a proper database, real API tokens, and a list of guilds that should be tracked by the system, once you're done you can start the app.

    node index.js

### Installing Web UI Leaderboard

To get started, clone down the repository using:

    git clone https://github.com/Senither/Hypixel-Skyblock-Leaderboard.git

Next go into the `Hypixel-Skyblock-Leaderboard/web` folder and install all the dependencies using Yarn.

    yarn

While the dependencies are being installed go to the config file to setup the API endpoint URL, the config can be found at `web/assets/js/config.js`, once that's done and the installation have finished, you can now build the project.

    yarn prod

Building the app with `prod` will build all the assets for a production environment, you can also use `dev` for a development environment, or `watch` for setting up a watcher that will re-build the project anytime it sees changes being made to the files.

Now you should be done, and ready to use the site, to view the site open the `index.html` file at `web/public`.

> Note: The site should be hosted at the root of a domain, or sub-domain for the paths in the index file to work correctly, if it's not being hosted with a domain you should edit the `script` and `link` HTML tags to point to the resources.

### Configuration

#### Port

This is the port that the API should be running on, make sure the port is exposed on the machine the API is hosted on so that the [Skyblock Assistant](https://github.com/Senither/Hypixel-Skyblock-Assistant) project, and other projects is able to talk and pull data from the API.

#### API URL & API Token

The API URL and Token is the URL the internal API servlet is running on, and the secret token used to communicate with the internal API in the [Skyblock Assistant](https://github.com/Senither/Hypixel-Skyblock-Assistant) project.

#### Database

The database properties are used to connect to the database that the API should use, the database is required for the API to function correctly since tracked guilds, player data, and metrics are all stored in the database, and then retrived when requests are made to the API.

#### Guilds

The guilds is a list of Hypixel guild IDs that the API should track, any guild ID on the list will automatically be scanned every 24 hours.

## License

Hypixel Skyblock Leaderboard is open-sourced software licensed under the [MIT License](https://opensource.org/licenses/MIT).
