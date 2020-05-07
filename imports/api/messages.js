import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

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
    async 'posts.insert' (room, user, message) {
        check(room, checkRoomName);
        check(user, String);
        check(message, String);

        room = room.trim()
        message = message.trim()

        if (message != '') {
            const command = getCommandFromMessage(message)
            if (command) {
                if (command.command == 'stock') {
                    if (Meteor.isServer) {
                        const message = await insertStockPost(command.arg)

                        Messages.insert({
                            user: 'Bot',
                            message,
                            room,
                            createdAt: new Date(),
                        })
                    }
                } else {
                    Messages.insert({
                        user: 'Bot',
                        message: `Unrecognized command '${command.command}'`,
                        room,
                        createdAt: new Date(),
                    })
                }
                return ;
            }

            Messages.insert({
                user,
                message,
                room,
                createdAt: new Date(),
            })
        }
    }
})