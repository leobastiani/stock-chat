import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import MessageCommand from "./MessageCommand";

export const Messages = new Mongo.Collection('messages');

export const checkRoomName = Match.Where((room) => {
    check(room, String);
    if (room.length > 30) {
        throw new Match.Error('room name too long')
    }

    return true
});

if (Meteor.isServer) {
    Meteor.publish('messages', (room) => {
        return Messages.find({ room: { $eq: room } });
    });
}

Meteor.methods({
    async 'messages.insert' (room, user, message) {
        check(room, checkRoomName);
        check(user, String);
        check(message, String);

        room = room.trim()
        message = message.trim()

        if (message != '') {
            const mc = new MessageCommand(message)
            if (mc.isCommand) {
                if (mc.command == 'stock' && Meteor.isServer) {
                    const stockQuote = await new StockQuote(mc.arg)
                    Messages.insert({
                        user: 'Bot',
                        message: stockQuote.message,
                        room,
                        createdAt: new Date(),
                    })
                }
            } else {
                Messages.insert({
                    user,
                    message,
                    room,
                    createdAt: new Date(),
                })
            }
        }
    }
})