import csv from 'csvtojson'
import { Messages } from "/imports/api/messages";

export default class StockQuote {
    static KEYS = ['Symbol', 'Date', 'Time', 'Open', 'High', 'Low', 'Close', 'Volume']

    constructor(stock_code) {
        this.stock_code = stock_code

        return this.asyncConstructor().then(() => this)
    }

    async asyncConstructor() {
        const json = await StockQuote.fromApiAsJson(this.stock_code)
        for (const key of StockQuote.KEYS) {
            this[key] = json[key]
        }

        this.isInvalid = this.Close == 'N/D'
    }

    static fromApi(stock_code) {
        const { content } = HTTP.get('https://stooq.com/q/l/', {
            params: {
                s: stock_code,
                f: 'sd2t2ohlcv',
                h: '',
                e: 'csv',
            }
        })
    
        return content
    }

    static async fromApiAsJson(stock_code) {
        const array = await csv().fromString(await this.fromApi(stock_code))
        return array[0]
    }
}

Meteor.methods({
    async stock_quote_message(stock_code) {
        try {
            const stockQuote = await new StockQuote(stock_code)
            if (stockQuote.isInvalid) {
                return `Quote ${stockQuote.Symbol} is invalid`
            }
            else {
                return `${stockQuote.Symbol} quote is $${stockQuote.Close} per share`
            }
        }
        catch(e) {
            throw e;
            return 'Server unavailable'
        }
    }
})