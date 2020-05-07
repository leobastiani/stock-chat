import { Meteor } from 'meteor/meteor'
import assert from 'assert'
import { checkRoomName } from './messages'
import { check } from 'meteor/check'

if (Meteor.isServer) {
  describe('checkRoomName', () => {
    it('must be string', () => {
      assert.throws(() => check(1, checkRoomName), {
        errorType: 'Match.Error',
        message: 'Match error: Match error: Expected string, got number'
      })
    })

    it('must < 30', () => {
      const room = new Array(31).fill('a').join()
      assert.throws(() => check(room, checkRoomName), {
        errorType: 'Match.Error',
        message: 'Match error: Match error: room name too long'
      })
    })

    it('can be anything', () => {
      check('room 👍', checkRoomName)
    })
  })
}
