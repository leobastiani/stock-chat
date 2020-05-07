export default class MessageCommand {
  constructor (message) {
    this.message = message

    const match = message.match(/^\/(\w+)(?:\s*=\s*(.*))?$/)
    this.isCommand = Boolean(match)
    if (this.isCommand) {
      const [_, command, arg] = match
      this.command = command
      this.arg = arg
    }
  }
}
