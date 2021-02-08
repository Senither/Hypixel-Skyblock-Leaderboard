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
    return cache[player.uuid]
  }

  // Calculates the player skill, slayer, and dungeon weights.
  const skillWeight = calculatePlayerSkillWeight(player)
  const slayerWeight = calculatePlayerSlayerWeight(player)
  const dungeonWeight = calculatePlayerDungeonWeight(player)

  // Sums up the total weight and overflow valaues
  let totalWeight = skillWeight.total.weight + slayerWeight.total.weight + dungeonWeight.total.weight

  let totalOverflow = skillWeight.total.overflow + slayerWeight.total.overflow + dungeonWeight.total.overflow

  // Creates the completed weight object, and stores it in the cache and returns it.
  return (cache[player.uuid] = {
    total: totalWeight + totalOverflow,
    weight: totalWeight,
    overflow: totalOverflow,
    skills: skillWeight,
    slayers: slayerWeight,
    dungeons: dungeonWeight,
    last_updated_at: player.last_updated_at,
  })
}

/**
 * The experience required to reach level 50 in any skill.
 *
 * @type {Number}
 */
const level50SkillExp = 55172425

/**
 * The experience required to reach level 60 in any skill.
 *
 * @type {Number}
 */
const level60SkillExp = 111672425

/**
 * The skill weight exponents and dividers, these values are
 * used to calculate a skills weight, the divider value is
 * only used for calculating a skills overflow value.
 *
 * @type {Object}
 */
const skillWeights = {
  // Maxes out mining at 1,750 points at 60.
  mining: {
    expo: 1.18207448,
    divr: 259634,
    lvlCap: 60,
  },
  // Maxes out foraging at 850 points at level 50.
  foraging: {
    expo: 1.232826,
    divr: 259634,
    lvlCap: 50,
  },
  // Maxes out enchanting at 450 points at level 60.
  enchanting: {
    expo: 0.96976583,
    divr: 882758,
    lvlCap: 60,
  },
  // Maxes out farming at 2,200 points at level 60.
  farming: {
    expo: 1.217848139,
    divr: 220689,
    lvlCap: 60,
  },
  // Maxes out combat at 800 points at level 50.
  combat: {
    expo: 1.22307,
    divr: 275862,
    lvlCap: 50,
  },
  // Maxes out fishing at 2,500 points at level 50.
  fishing: {
    expo: 1.406418,
    divr: 88274,
    lvlCap: 50,
  },
  // Maxes out alchemy at 200 points at level 50.
  alchemy: {
    expo: 1.0,
    divr: 1103448,
    lvlCap: 50,
  },
  // Maxes out taming at 500 points at level 50.
  taming: {
    expo: 1.14744,
    divr: 441379,
    lvlCap: 50,
  },
}

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
    let skillWeight = skillWeights[type]

    // Gets the XP required to max out the skill.
    let maxSkillLevelXP = skillWeight.lvlCap == 60 ? level60SkillExp : level50SkillExp

    // Gets the current skills XP and level from the given player object.
    let experience = player[type + '_xp']
    let level = player[type]

    // Calculates the base weight using the players level, if the players level
    // is 50/60 we'll round off their weight to get a nicer looking number.
    let base = Math.pow(level * 10, 0.5 + skillWeight.expo + level / 100) / 1250
    if (experience > maxSkillLevelXP) {
      base = Math.round(base)
    }

    // If the skill XP is below the requirements for a level 50/60 skill we'll
    // just return our weight to the weight object builder right away.
    if (experience <= maxSkillLevelXP) {
      return {
        weight: base,
        overflow: 0,
      }
    }

    // Calculates the skill overflow weight and returns it to the weight object builder.
    return {
      weight: base,
      overflow: Math.pow((experience - maxSkillLevelXP) / skillWeight.divr, 0.968),
    }
  })
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
}

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
    let divider = slayerWeights[type]
    let experience = player[type + '_xp']

    if (experience <= 1000000) {
      return {
        weight: experience == 0 ? 0 : experience / divider,
        overflow: 0,
      }
    }

    // Calculates the slayer and overflow weight and
    // returns it to the weight object builder.
    let base = 1000000 / divider
    let remaining = experience - 1000000
    let overflow = Math.pow(remaining / (divider * 1.5), 0.942)

    return {
      weight: base + overflow,
      overflow: 0,
    }
  })
}

/**
 * The experience required to reach level 50 in any dungeon class.
 *
 * @type {Number}
 */
const level50DungeonExp = 569809640

/**
 * The dungeon weight percentage, these values are used to help
 * calculate a dungeon weight by specifying how much of the
 * total weight calculated that should be counted, all
 * XP past level 50 will be given at 1/4 the rate.
 *
 * @type {Object}
 */
const dungeonWeights = {
  // Maxes cata weight at 9,500 at level 50
  catacomb: 0.0002149604615,
  // Maxes healer weight at 200 at level 50
  healer: 0.0000045254834,
  // Maxes mage weight at 200 at level 50
  mage: 0.0000045254834,
  // Maxes berserker weight at 200 at level 50
  berserk: 0.0000045254834,
  // Maxes archer weight at 200 at level 50
  archer: 0.0000045254834,
  // Maxes tank weight at 200 at level 50
  tank: 0.0000045254834,
}

/**
 * Calculates a players dungeon weight using their
 * current stats, and the dungeon weight table.
 *
 * @param  {Object} player
 * @return {Object}
 */
function calculatePlayerDungeonWeight(player) {
  return buildWeightObject(dungeonWeights, type => {
    // Gets the level percentage modifier, this is used to figure
    // out how much of the total weight is actually counted.
    let percentageModifier = dungeonWeights[type]

    // Gets the current dungeon XP and level from the given player object.
    let experience = player[type + '_xp']
    let level = player[type]

    // Calculates the base weight using the players level
    let base = Math.pow(level, 4.5) * percentageModifier

    // If the dungeon XP is below the requirements for a level 50 dungeon we'll
    // just return our weight to the weight object builder right away.
    if (experience <= level50DungeonExp) {
      return {
        weight: base,
        overflow: 0,
      }
    }

    // Calculates the XP above the level 50 requirement, and the splitter
    // value, weight given past level 50 is given at 1/4 the rate.
    let remaining = experience - level50DungeonExp
    let splitter = (4 * level50DungeonExp) / base

    // Calculates the dungeon overflow weight and returns it to the weight object builder.
    return {
      weight: Math.floor(base),
      overflow: Math.pow(remaining / splitter, 0.968),
    }
  })
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
  }

  // Loops through every weight group type, passing the type to the
  // callback function and saving the result as the weight type.
  for (let type of Object.keys(weightGroup)) {
    weight[type] = callback(type)

    weight.total.weight += weight[type].weight
    weight.total.overflow += weight[type].overflow
  }

  return weight
}

/**
 * The cache object, this will store every weight object that has
 * been calculate for every player the application is tracking.
 *
 * @type {Object}
 */
let cache = {}

/**
 * Checks if a cache is valid by making sure the player has a cached
 * entry, and that their stats haven't been updated since
 * the weight object was calculated.
 *
 * @param  {Object}  player
 * @return {Boolean}
 */
function isCacheValid(player) {
  return cache.hasOwnProperty(player.uuid) && cache[player.uuid].last_updated_at == player.last_updated_at
}
