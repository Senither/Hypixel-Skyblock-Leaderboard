
module.exports = function (guild) {
    let skill = (guild.average_skill_progress * 3.5);
    let slayer = (guild.average_slayer / 150000);

    let multiplier = (guild.members / 125) + (1 - guild.members / 125) / 1.5;

    let total = ((skill + slayer) * multiplier);

    return {
        total: parseFloat(total.toFixed(3)),
        skill: parseFloat(skill.toFixed(3)),
        slayer: parseFloat(slayer.toFixed(3)),
        multiplier: parseFloat(multiplier.toFixed(3)),
    };
};
