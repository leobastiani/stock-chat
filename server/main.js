import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
import '/imports/api/messages';
import './StockQuote';

Meteor.methods({
    /**
     * Returns the user Bot
     */
    Bot() {
        const Bot = Accounts.findUserByUsername('Bot')
        if (Bot) {
            return Bot
        }
        Accounts.createUser({
            username: 'Bot'
        })
        return Accounts.findUserByUsername('Bot')
    }
})

Meteor.startup(() => {
    // ensure user bot exists
    Meteor.call('Bot')
})