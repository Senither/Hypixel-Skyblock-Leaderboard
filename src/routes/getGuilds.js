
module.exports = (request, response) => {
    console.log('Get Guilds route was hit!');

    response.json({
        status: 200,
        message: 'Hello, World!'
    });
};
