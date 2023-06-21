const { emojis } = require('../constants')

module.exports = [
    {
        name: 'XP Coin',
        description: 'This coin gives you a 50% XP boost for 1 hour',
        sellPrice: 1000000,
        buyPrice: 1500000,
        tradeValue: 23000,
        emoji: emojis.xpCoin,
        id: 'xp coin',
        type: 'Power-Up',
        rarity: 'Uncommon',
        url: 'https://imgur.com/OjgbjtL.png',
        usable: true,
        marketable: true
    },
    {
        name: 'Cheque',
        description: 'A handy little cheque that will give you an extra bit of bank space',
        sellPrice: 0,
        buyPrice: 50000,
        tradeValue: 20000,
        emoji: emojis.cheque,
        id: 'cheque',
        type: 'Power Up',
        rarity: 'Common',
        url: 'https://imgur.com/ziHIdlX.png',
        usable: true,
        marketable: true
    },
    {
        name: 'Shovel',
        description: 'Allows you to dig',
        sellPrice: 100,
        buyPrice: 15000,
        tradeValue: 2000,
        emoji: emojis.shovel,
        id: 'shovel',
        type: 'Tool',
        rarity: 'Common',
        url: 'https://imgur.com/kyYulbe.png',
        usable: false,
        marketable: true
    },
    {
        name: 'Rifle',
        description: 'Get one of these and go out to hunt',
        sellPrice: 10000,
        buyPrice: 20000,
        tradeValue: 200,
        emoji: emojis.rifle,
        id: 'rifle',
        type: 'Tool',
        rarity: 'Common',
        url: '',
        usable: false,
        marketable: true
    },
    {
        name: 'Axe',
        description: 'Wanna cut down a tree? You need one of these',
        sellPrice: 5000,
        buyPrice: 10000,
        tradeValue: 2000,
        emoji: emojis.axe,
        id: 'axe',
        type: 'Tool',
        rarity: 'Common',
        url: '',
        usable: false,
        marketable: true
    },
    {
        name: 'Pickaxe',
        description: 'To go mining for minerals this could be helpful',
        sellPrice: 5000,
        buyPrice: 15000,
        tradeValue: 2500,
        emoji: emojis.pickaxe,
        id: 'pickaxe',
        type: 'Tool',
        rarity: 'Common',
        url: '',
        usable: false,
        marketable: true
    },
]