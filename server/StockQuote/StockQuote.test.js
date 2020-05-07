import assert from "assert";
import nock from 'nock';
import { HTTP } from 'meteor/http'
import QuoteRequester from './QuoteRequester';

const stockCodeAndResponses = {
    'aapl.us': `Symbol,Date,Time,Open,High,Low,Close,Volume\nAAPL.US,2020-05-06,22:00:01,300.46,303.24,298.87,300.63,35583438`,
    'invalid': `Symbol,Date,Time,Open,High,Low,Close,Volume\nINVALID,N/D,N/D,N/D,N/D,N/D,N/D,N/D`
}

describe('QuoteRequester with nock', () => {
    beforeEach(() => {
        for (const stockCode in stockCodeAndResponses) {
            nock('https://stooq.com/')
                .get(`/q/l/?s=${stockCode}&f=sd2t2ohlcv&h&e=csv`)
                .reply(200, stockCodeAndResponses[stockCode])
        }
    })

    it('requires', async () => {
        const content = await StockQuote.request('aapl.us')
        assert(content, stockCodeAndResponses['aapl.us'])
    })

    it('requires an invalid quote', async () => {
        const stockQuote = await new StockQuote('invalid')
        assert(stockQuote.isInvalid, true)
    })

    it('requires a valid quote', async () => {
        const stockQuote = await new StockQuote('aapl.us')
        assert(stockQuote.isInvalid, false)

        assert(stockQuote.symbol, 'AAPL.US')
        assert(stockQuote.date, '2020-05-06')
        assert(stockQuote.time, '22:00:01')
        assert(stockQuote.open, '300.46')
        assert(stockQuote.high, '303.24')
        assert(stockQuote.low, '298.87')
        assert(stockQuote.close, '300.63')
        assert(stockQuote.volume, '35583438')
    })
})
