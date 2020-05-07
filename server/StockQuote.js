import csv from 'csvtojson'

export default class StockQuote {
    static KEYS = ['Symbol', 'Date', 'Time', 'Open', 'High', 'Low', 'Close', 'Volume']

    constructor(stock_code) {
        this.stock_code = stock_code

        return this.asyncConstructor().then(() => this)
    }

    async asyncConstructor() {
        try {
            const json = await StockQuote.fromApiAsJson(this.stock_code)
            for (const key of StockQuote.KEYS) {
                this[key] = json[key]
            }

            this.isInvalid = this.Close == 'N/D'
            this.setupMessage()
        } catch(e) {
            this.Symbol = this.stock_code.toUpperCase()
            this.isInvalid = true
            this.message = 'Server unavailable'
        }
    }

    setupMessage() {
        if (this.isInvalid) {
            this.message = `Quote ${this.Symbol} is invalid`
        }
        else {
            this.message = `${this.Symbol} quote is $${this.Close} per share`
        }
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