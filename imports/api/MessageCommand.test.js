import assert from "assert";
import MessageCommand from './MessageCommand'

it('can not be a command', () => {
    const messageCommand = new MessageCommand('hello, how are you?')
    assert(!messageCommand.isCommand)
})

it('has properties', () => {
    const messageCommand = new MessageCommand('/some_command      =   some parameters')
    assert(messageCommand.isCommand)
    assert.equal(messageCommand.command, 'some_command')
    assert.equal(messageCommand.parameters, 'some parameters')
})