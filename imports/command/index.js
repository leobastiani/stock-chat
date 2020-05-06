import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import csv from 'csvtojson'

export const getCommandFromMessage = (message) => {
    const match = message.match(/^\/(\w+)(?:=(.*))?/)
    if (!match) {
        return match
    }

    const [_, command, arg] = match
    return { command, arg }
}

export const insertStockPost = async (stock_code) => {
    const { content } = HTTP.get('https://stooq.com/q/l/', {
        params: {
            s: stock_code,
            f: 'sd2t2ohlcv',
            h: '',
            e: 'csv',
        }
    })
    return await contetAsMessage(content)
}

const contetAsMessage = async (content) => {
    const json = (await csv().fromString(content))[0]
    if(json.Close == 'N/D') {
        return `${json.Symbol} is not a valid quote`
    }
    const value = parseFloat(json.Close).toFixed(2);
    return `${json.Symbol} quote is $${value} per share`
}