
const Task = require('./task');

class Manager {
    constructor() {
        this.tasks = {};
    }

    register(self, taskName) {
        const task = require(`./tasks/${taskName}`);
        const instance = new task;

        if (! (instance instanceof Task)) {
            throw new Error('Invalid task name provided!');
        }

        this.tasks[taskName] = setInterval(() => {
            try {
                instance.run(self);
            } catch (e) {
                console.error(`${taskName} failed to execute due to an error: `, e);
            }
        }, instance.interval());
    }
}

module.exports = new Manager;
