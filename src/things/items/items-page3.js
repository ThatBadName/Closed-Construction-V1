const { emojis } = require('../constants')

module.exports = [
    {
        name: 'Berries',
        description: 'Can give either a good effect or a bad one',
        sellPrice: 12000,
        buyPrice: 40000,
        tradeValue: 6000,
        emoji: emojis.berries,
        id: 'berries',
        type: 'Collectable',
        rarity: 'Uncommon',
        url: 'https://imgur.com/IifsgUx.png',
        usable: true,
        marketable: true
    },
    {
        name: 'Splinter Coin',
        description: 'Coin for the pog host and bot',
        sellPrice: 2000000,
        buyPrice: 3000000,
        tradeValue: 1500000,
        emoji: emojis.splinter,
        url: 'https://i.imgur.com/AijsOdE.png',
        id: 'splinter coin',
        type: 'Collectable',
        rarity: 'Rare',
        craftable: false,
        usable: true,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    }
]