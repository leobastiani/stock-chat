import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import MessageCommand from "./MessageCommand";
import { publishComposite } from 'meteor/reywood:publish-composite';

export const Messages = new Mongo.Collection('messages');

export const checkRoomName = Match.Where((room) => {
    check(room, String);
    if (room.length > 30) {
        throw new Match.Error('room name too long')
    }

    return true
});

if (Meteor.isServer) {
    publishComposite('messages', function(room) {
        return {
            find() {
                return Messages.find({ room: { $eq: room } })
            },
            children: [{
                find({ owner }) {
                    return Meteor.users.find({ _id: owner }, { fields: { username: 1 } });
                }
            }]
        }
    });
}

Meteor.methods({
    async 'messages.insert' (room, message) {
        check(room, checkRoomName);
        check(message, String);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        // owner might be Bot if it is a command
        let owner = this.userId

        room = room.trim()
        message = message.trim()

        if (message != '') {
            const mc = new MessageCommand(message)
            if (mc.isCommand) {
                if (Meteor.isClient) return;

                owner = Meteor.call('Bot')._id
                if (mc.command == 'stock') {
                    message = await Meteor.call('stock_quote_message', mc.arg)
                }
            }

            Messages.insert({
                owner,
                message,
                room,
                createdAt: new Date(),
            })
        }
    }
})