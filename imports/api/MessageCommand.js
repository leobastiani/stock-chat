export default class MessageCommand {
    constructor(message) {
        this.message = message

        const match = message.match(/^\/(\w+)(?:\s*=\s*(.*))?$/)
        this.isCommand = Boolean(match)
        if(this.isCommand) {
            const [_, command, parameters] = match
            this.command = command
            this.parameters = parameters
        }
    }
}
