const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
   itemId: String,
   itemEmoji: String,
   itemStock: Number,
   itemPrice: Number,
   itemDiscount: Number,
   itemName: String,
   darkMarket: Boolean,
   regularMarket: Boolean,
   offerId: String,
   number: Number,
   maxStock: Number
}, {
   timestamps: false
})

const name = 'marketOffer'
module.exports = mongoose.models[name] || mongoose.model(name, schema)