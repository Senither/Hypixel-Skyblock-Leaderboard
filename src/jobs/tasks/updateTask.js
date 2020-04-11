
const Task = require('../task');

class UpdateTask extends Task {
    interval() {
        return 10 * 1000;
    }

    run(app) {
        console.log('Running!');
    }
}

module.exports = UpdateTask;
