
/**
 * The weight calculations is taken from the Hypixel Skyblock Assistant
 * project, the source code can be found using the link provided below.
 *
 * If the weight system changes in the Hypixel Skyblock Assistant bot
 * in the future, expect this file to be updated too so that
 * the weight calculations will match.
 *
 * @repo    https://github.com/Senither/Hypixel-Skyblock-Assistant
 * @package https://github.com/Senither/Hypixel-Skyblock-Assistant/tree/master/app/src/main/java/com/senither/hypixel/statistics/weight
 */

module.exports = function (player) {
    // Checks if the players weight data has already been calculated,
    // and if that data is still valid, if it is we'll just return
    // it directly instead of re-calculating it again.
    if (isCacheValid(player)) {
        return cache[player.uuid];
    }

    // Calculates the player skill, slayer, and dungeon weights.
    const skillWeight = calculatePlayerSkillWeight(player);
    const slayerWeight = calculatePlayerSlayerWeight(player);
    const dungeonWeight = calculatePlayerDungeonWeight(player);

    // Sums up the total weight and overflow valaues
    let totalWeight = (
        skillWeight.total.weight +
        slayerWeight.total.weight +
        dungeonWeight.total.weight
    );

    let totalOverflow = (
        skillWeight.total.overflow +
        slayerWeight.total.overflow +
        dungeonWeight.total.overflow
    );

    // Creates the completed weight object, and stores it in the cache and returns it.
    return cache[player.uuid] = {
        total: totalWeight + totalOverflow,
        weight: totalWeight,
        overflow: totalOverflow,
        skills: skillWeight,
        slayers: slayerWeight,
        dungeons: dungeonWeight,
        last_updated_at: player.last_updated_at,
    };
};

/**
 * The experience required to reach level 50 in any skill.
 *
 * @type {Number}
 */
const level50SkillExp = 55172425;

/**
 * The skill weight exponents and dividers, these values are
 * used to calculate a skills weight, the divider value is
 * only used for calculating a skills overflow value.
 *
 * @type {Object}
 */
const skillWeights = {
    // Maxes out mining at 850 points at 50.
    mining: {
        expo: 1.232826,
        divr: 259634,
    },
    // Maxes out foraging at 850 points at level 50.
    foraging: {
        expo: 1.232826,
        divr: 259634,
    },
    // Maxes out enchanting at 250 points at level 50.
    enchanting: {
        expo: 1.035905,
        divr: 882758,
    },
    // Maxes out enchanting at 250 points at level 50.
    enchanting: {
        expo: 1.035905,
        divr: 882758,
    },
    // Maxes out farming at 1,000 points at level 50.
    farming: {
        expo: 1.258976,
        divr: 220689,
    },
    // Maxes out combat at 800 points at level 50.
    combat: {
        expo: 1.22307,
        divr: 275862,
    },
    // Maxes out fishing at 2,500 points at level 50.
    fishing: {
        expo: 1.406418,
        divr: 88274,
    },
    // Maxes out alchemy at 200 points at level 50.
    alchemy: {
        expo: 1.0,
        divr: 1103448,
    },
    // Maxes out taming at 500 points at level 50.
    taming: {
        expo: 1.14744,
        divr: 441379,
    },
};

/**
 * Calculates a players skill weight using their
 * current stats, and the skill weight table.
 *
 * @param  {Object} player
 * @return {Object}
 */
function calculatePlayerSkillWeight(player) {
    return buildWeightObject(skillWeights, type => {
        // Gets the skill weight properties for the current weight type,
        // this contains the skill weight exponent and divider.
        let skillWeight = skillWeights[type];

        // Gets the current skills XP and level from the given player object.
        let experience = player[type + '_xp'];
        let level = player[type];

        // Calculates the base weight using the players level, if the players level
        // is 50 we'll round off their weight to get a nicer looking number.
        let base = Math.pow(level * 10, 0.5 + skillWeight.expo + (level / 100)) / 1250;
        if (experience > level50SkillExp) {
            base = Math.round(base);
        }

        // If the skill XP is below the requirements for a level 50 skill we'll
        // just return our weight to the weight object builder right away.
        if (experience <= level50SkillExp) {
            return {
                weight: base,
                overflow: 0,
            };
        }

        // Calculates the skill overflow weight and returns it to the weight object builder.
        return {
            weight: base,
            overflow: Math.pow((experience - level50SkillExp) / skillWeight.divr, 0.968),
        };
    });
}

/**
 * The slayer weight breakpoints, slayer weight will be
 * given everytime a player reaches each breakpoint
 * for each slayer type.
 *
 * @type {Object}
 */
const slayerWeights = {
    revenant: 2208,
    tarantula: 2118,
    sven: 1962,
};


/**
 * Calculates a players slayer weight using their
 * current stats, and the slayer weight table.
 *
 * @param  {Object} player
 * @return {Object}
 */
function calculatePlayerSlayerWeight(player) {
    return buildWeightObject(slayerWeights, type => {
        // Prepares the divider and slayer XP for the current slayer type.
        let divider = slayerWeights[type];
        let experience = player[type + '_xp'];

        // Calculates the slayer weight and returns it to the weight object builder.
        return {
            weight: experience == 0 ? 0 : experience / divider,
            overflow: 0,
        };
    });
}

/**
 * The experience required to reach level 50 in any dungeon class.
 *
 * @type {Number}
 */
const level50DungeonExp = 569809640;

/**
 * The dungeon weight breakpoints, these values are used to
 * calculate a dungeon class weight by limiting points at
 * level 50 to the breakpoints, all XP past level 50
 * will be given at 1/4 the rate.
 *
 * @type {Object}
 */
const dungeonWeights = {
    catacomb: 1000,
    healer: 500,
    mage: 500,
    berserk: 500,
    archer: 500,
    tank: 500,
};

/**
 * Calculates a players dungeon weight using their
 * current stats, and the dungeon weight table.
 *
 * @param  {Object} player
 * @return {Object}
 */
function calculatePlayerDungeonWeight(player) {
    return buildWeightObject(dungeonWeights, type => {
        // Gets the max amount of points that can be rewarded
        // at level 50 for the given dungeon type.
        let maxPoints = dungeonWeights[type];

        // Gets the current dungeon XP and level from the given player object.
        let experience = player[type + '_xp'];
        let level = player[type];

        // Calculates the base weight using the players level
        let base = maxPoints * ((level * 2) / 100);

        // If the dungeon XP is below the requirements for a level 50 dungeon we'll
        // just return our weight to the weight object builder right away.
        if (experience <= level50DungeonExp) {
            return {
                weight: base,
                overflow: 0,
            };
        }

        // Calculates the XP above the level 50 requirement, and the splitter
        // value, weight given past level 50 is given at 1/4 the rate.
        let remaining = experience - level50DungeonExp;
        let splitter = (level50DungeonExp / maxPoints) * 4;

        // Calculates the dungeon overflow weight and returns it to the weight object builder.
        return {
            weight: slayerWeight,
            overflow: Math.pow(remaining / splitter, 0.968),
        };
    });
}

/**
 * Builds the weight object by looping over the given weight
 * group and passing each value to the callback, then
 * summing up the total weight and overflow.
 *
 * @param  {Object}   weightGroup
 * @param  {Function} callback
 * @return {Object}
 */
function buildWeightObject(weightGroup, callback) {
    // Prepares the weight instance that should be returned to the user.
    let weight = {
        total: {
            weight: 0,
            overflow: 0,
        },
    };

    // Loops through every weight group type, passing the type to the
    // callback function and saving the result as the weight type.
    for (let type of Object.keys(weightGroup)) {
        weight[type] = callback(type);

        weight.total.weight += weight[type].weight;
        weight.total.overflow += weight[type].overflow;
    }

    return weight;
}

/**
 * The cache object, this will store every weight object that has
 * been calculate for every player the application is tracking.
 *
 * @type {Object}
 */
let cache = {};

/**
 * Checks if a cache is valid by making sure the player has a cached
 * entry, and that their stats haven't been updated since
 * the weight object was calculated.
 *
 * @param  {Object}  player
 * @return {Boolean}
 */
function isCacheValid(player) {
    return cache.hasOwnProperty(player.uuid)
        && cache[player.uuid].last_updated_at == player.last_updated_at;
}
