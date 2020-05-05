import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Posts = new Mongo.Collection('posts');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('posts', (room) => {
        return Posts.find({ room: { $eq: room } }, { sort: { createdAt: -1 }, limit: 50 });
    });
}

Meteor.methods({
    'posts.insert' (room, user, message) {
        check(room, String);
        check(user, String);
        check(message, String);
        
        if(message != '') {
            Posts.insert({
                user,
                message,
                room,
                createdAt: new Date(),
            });
        }
    }
})