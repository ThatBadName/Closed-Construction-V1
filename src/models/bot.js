const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
   blacklistCaseAmount: {
    type: Number,
    default: 0
   },
   announcement: {
      type: String,
      default: 'There is nothing here'
   },

   nextLotto: Date,
   nextUpdate: Date,
   lottoEntries: [],

   nextMarket: Date,
   nextMarketUpdate: Date
}, {
   timestamps: false
})

const name = 'botData'
module.exports = mongoose.models[name] || mongoose.model(name, schema)