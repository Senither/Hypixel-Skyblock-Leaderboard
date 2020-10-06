
module.exports = function (guild) {
    // Maxes out a level 50 average guild at 500 skill points, and
    // setting the middle point in terms of points at level 41,
    // which is the middle point in terms of XP in the game
    let skill = Math.pow(guild.average_skill_progress * 10, 0.5 + (guild.average_skill_progress / 100));

    // Calculates the catacomb weight by adding 200% to the current average,
    // then powering it by an additional 4.8455% on top of that, that
    // will cause a level 50 average to max out at 125 points.
    let catacomb = Math.pow(guild.average_catacomb * 2, 1.048455);

    // Calcualtes the slayer weight with a flat curve,
    // giving 1 point every 12,000 average slayer up
    // to 3,000,000 XP, the weight past the 3 million
    // limit is first divided by 18,000, and then
    // reducded by 10%
    let slayerOverflow = 3000000 - guild.average_slayer;
    let slayer = slayerOverflow > 0
        ? guild.average_slayer / 12000
        : (guild.average_slayer + slayerOverflow) / 12000;

    if (slayerOverflow < 0) {
        slayer += Math.pow((slayerOverflow * -1) / 18000, .90);
    }

    // Creates the multiplier, where the max value is 1 at 125 members
    // which is the guild member limit on Hypixel, guilds with less
    // points will have points deducted from their total score
    // depending on the amount of missing players.
    let frequency = Math.sin(guild.members / (125 / .927296)) + .2;

    let multiplier = (guild.members / 125) + (1 - guild.members / 125) * frequency;

    // Calculates the total amount of points for the guild by summing
    // up our values and using our multiplier to deduct points
    // if the guild has a low member count.
    let total = (skill + catacomb + slayer) * multiplier;

    return {
        total: parseFloat(total.toFixed(3)),
        skill: parseFloat(skill.toFixed(3)),
        slayer: parseFloat(slayer.toFixed(3)),
        catacomb: parseFloat(catacomb.toFixed(3)),
        multiplier: parseFloat(multiplier.toFixed(3)),
    };
};
