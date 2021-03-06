import csv from 'csvtojson'
export default class StockQuote {
  static KEYS = [
    'Symbol',
    'Date',
    'Time',
    'Open',
    'High',
    'Low',
    'Close',
    'Volume'
  ]

  constructor (stock_code) {
    this.stock_code = stock_code

    return this.asyncConstructor().then(() => this)
  }

  async asyncConstructor () {
    const json = await StockQuote.fromApiAsJson(this.stock_code)
    for (const key of StockQuote.KEYS) {
      this[key] = json[key]
    }

    this.isInvalid = this.Close == 'N/D'
  }

  static fromApi (stock_code) {
    const { content } = HTTP.get('https://stooq.com/q/l/', {
      params: {
        s: stock_code,
        f: 'sd2t2ohlcv',
        h: '',
        e: 'csv'
      }
    })

    return content
  }

  static async fromApiAsJson (stock_code) {
    const array = await csv().fromString(await this.fromApi(stock_code))
    return array[0]
  }
}

export class StockQuoteMessageError extends Error {
  get name () {
    return 'StockQuoteMessageError'
  }
}

Meteor.methods({
  async 'StoqueQuote.message' (stock_code) {
    if (!stock_code) {
      throw new StockQuoteMessageError('Missing stock code')
    }

    try {
      const stockQuote = await new StockQuote(stock_code)
      if (stockQuote.isInvalid) {
        throw new StockQuoteMessageError(
          `Quote ${stockQuote.Symbol} is invalid`
        )
      } else {
        return `${stockQuote.Symbol} quote is $${stockQuote.Close} per share`
      }
    } catch (e) {
      if (e instanceof StockQuoteMessageError) {
        throw e
      }
      throw new StockQuoteMessageError('Server unavailable')
    }
  }
})
