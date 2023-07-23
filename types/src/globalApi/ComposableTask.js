export class ComposableTask {
    // eslint-disable-next-line no-unused-vars
    async then(onfulfilled) {
        return onfulfilled(await this.run());
    }
    async run() {
        throw new Error('ComposableTask - run is not implemented');
    }
}
