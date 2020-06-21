Hypixel Skyblock Leaderboard
============================

Hypixel Skyblock Leaderboard is a stateless API build for the [Hypixel Skyblock Assistant](https://github.com/Senither/Hypixel-Skyblock-Assistant/) Discord bot, the API creates a way to track guilds on the [Hypixel Network](https://hypixel.net/) for their SkyBlock gamemode, which can then be used to create metrics, guild, and player leaderboards.

<hr>

## Table of Content

 - [Prerequisites](#prerequisites)
 - [Installing Hypixel Skyblock Leaderboard](#installing-hypixel-skyblock-leaderboard)
 - [Configuration](#configuration)

### Prerequisites

 * NodeJS >= 8
 * Yarn >= 1.3
 * A SQL database, supports: [MySQL](https://www.mysql.com/), [MariaDB](https://mariadb.org/), and [SQLite3](https://www.sqlite.org/index.html).
 * Git
 * A running version of [Hypixel Skyblock Assistant](https://github.com/Senither/Hypixel-Skyblock-Assistant/)

### Installing Hypixel Skyblock Leaderboard

To get started, clone down the repository using:

    git clone https://github.com/Senither/Hypixel-Skyblock-Leaderboard.git

Next go into the `Hypixel-Skyblock-Leaderboard` folder and install all the dependencies using Yarn.

    yarn

While the dependencies are being installed you can copy the configuration file.

    cp config.example.json config.json


Next edit and setup the config file with a proper database, real API tokens, and a list of guilds that should be tracked by the system, once you're done you can start the app.

    node index.js

### Configuration

#### Port

This is the port that the API should be running on, make sure the port is exposed on the machine the API is hosted on so that the [Skyblock Assistant](https://github.com/Senither/Hypixel-Skyblock-Assistant/) project, and other projects is able to talk and pull data from the API.

#### API URL & API Token

The API URL and Token is the URL the internal API servlet is running on, and the secret token used to communicate with the internal API in the [Skyblock Assistant](https://github.com/Senither/Hypixel-Skyblock-Assistant/) project.

#### Database

The database properties are used to connect to the database that the API should use, the database is required for the API to function correctly since tracked guilds, player data, and metrics are all stored in the database, and then retrived when requests are made to the API.

#### Guilds

The guilds is a list of Hypixel guild IDs that the API should track, any guild ID on the list will automatically be scanned every 24 hours.

## License

Hypixel Skyblock Leaderboard is open-sourced software licensed under the [MIT License](https://opensource.org/licenses/MIT).
