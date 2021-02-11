module.exports = function (guild) {
  // Creates the multiplier, where the max value is 1 at 125 members
  // which is the guild member limit on Hypixel, guilds with less
  // points will have points deducted from their total score
  // depending on the amount of missing players.
  let frequency = Math.sin(guild.members / (125 / 0.927296)) + 0.2

  let multiplier = guild.members / 125 + (1 - guild.members / 125) * frequency

  // Calculates the total amount of points for the guild by using
  // our multiplier to deduct points from the total guild
  // weight if the guild has a low member count.
  let total = guild.weight * multiplier

  let weight = {
    total: parseFloat(total.toFixed(3)),
    skill: parseFloat(guild.skill_weight.toFixed(3)),
    slayer: parseFloat(guild.slayer_weight.toFixed(3)),
    catacomb: parseFloat(guild.dungeon_weight.toFixed(3)),
    multiplier: parseFloat(multiplier.toFixed(3)),
  }

  // Removes the database weight columns from the object
  delete guild.weight
  delete guild.skill_weight
  delete guild.slayer_weight
  delete guild.dungeon_weight

  return weight
}
