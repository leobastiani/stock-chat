import { Meteor } from 'meteor/meteor'
import assert from 'assert'
import nock from 'nock'
import StockQuote from './StockQuote'

const stockCodeAndResponses = {
  'aapl.us': `Symbol,Date,Time,Open,High,Low,Close,Volume\nAAPL.US,2020-05-06,22:00:01,300.46,303.24,298.87,300.63,35583438`,
  invalid: `Symbol,Date,Time,Open,High,Low,Close,Volume\nINVALID,N/D,N/D,N/D,N/D,N/D,N/D,N/D`
}

beforeEach(() => {
  nock.cleanAll()
})

describe('with nock', () => {
  beforeEach(() => {
    for (const stockCode in stockCodeAndResponses) {
      nock('https://stooq.com/')
        .get(`/q/l/?s=${stockCode}&f=sd2t2ohlcv&h&e=csv`)
        .reply(200, stockCodeAndResponses[stockCode])
    }
  })

  it('fromApi', async () => {
    const content = await StockQuote.fromApi('aapl.us')
    assert.strictEqual(content, stockCodeAndResponses['aapl.us'])
  })

  describe('invalid quote', () => {
    it('is invalid', async () => {
      const stockQuote = await new StockQuote('invalid')
      assert(stockQuote.isInvalid)
    })

    it('message', async () => {
      await assert.rejects(
        async () => await Meteor.call('StoqueQuote.message', 'invalid'),
        {
          name: 'StockQuoteMessageError',
          message: 'Quote INVALID is invalid'
        }
      )
    })
  })

  describe('valid quote', () => {
    it('has attributes', async () => {
      const stockQuote = await new StockQuote('aapl.us')
      assert(!stockQuote.isInvalid)
      assert.equal(stockQuote.Symbol, 'AAPL.US')
      assert.equal(stockQuote.Date, '2020-05-06')
      assert.equal(stockQuote.Time, '22:00:01')
      assert.equal(stockQuote.Open, '300.46')
      assert.equal(stockQuote.High, '303.24')
      assert.equal(stockQuote.Low, '298.87')
      assert.equal(stockQuote.Close, '300.63')
      assert.equal(stockQuote.Volume, '35583438')
    })

    it('message', async () => {
      const message = await Meteor.call('StoqueQuote.message', 'aapl.us')
      assert.equal(message, 'AAPL.US quote is $300.63 per share')
    })
  })
})

describe('without connection', () => {
  beforeEach(() => {
    nock.disableNetConnect()
  })

  it('stock quote with error', async () => {
    await assert.rejects(
      async () => await Meteor.call('StoqueQuote.message', 'aapl.us'),
      {
        name: 'StockQuoteMessageError',
        message: 'Server unavailable'
      }
    )
  })
})
