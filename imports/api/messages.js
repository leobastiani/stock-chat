import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { getCommandFromMessage, insertStockPost } from '/imports/command'

export const Messages = new Mongo.Collection('messages');

export function checkRoomName(romm) {
    return 'kk'
}

if (Meteor.isServer) {
    Meteor.publish('messages', (room) => {
        return Messages.find({ room: { $eq: room } });
    });
}

Meteor.methods({
    async 'posts.insert' (room, user, message) {
        check(room, String);
        check(user, String);
        check(message, String);

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