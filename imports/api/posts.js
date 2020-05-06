import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { getCommandFromMessage, insertStockPost } from '/imports/command'

export const Posts = new Mongo.Collection('posts');

if (Meteor.isServer) {
    Meteor.publish('posts', (room) => {
        return Posts.find({ room: { $eq: room } }, { sort: { createdAt: -1 }, limit: 50 });
    });
}

Meteor.methods({
    async 'posts.insert' (room, user, message) {
        check(room, String);
        check(user, String);
        check(message, String);

        if (message != '') {
            Posts.insert({
                user,
                message,
                room,
                createdAt: new Date(),
            })

            const command = getCommandFromMessage(message)
            if (command) {
                if (command.command == 'stock') {
                    if (Meteor.isServer) {
                        const message = await insertStockPost(command.arg)

                        Posts.insert({
                            user: 'Bot',
                            message,
                            room,
                            createdAt: new Date(),
                        })
                    }
                }
            }
        }
    }
})