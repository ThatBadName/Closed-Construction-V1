const { emojis } = require('../constants')

module.exports = [
    {
        name: 'Metal',
        description: 'Used to craft a rocket',
        sellPrice: 1000,
        buyPrice: 10000,
        tradeValue: 500,
        emoji: emojis.metal,
        id: 'metal',
        type: 'Craftable',
        rarity: 'Common',
        url: '',
        usable: false,
        marketable: true
    },
    {
        name: 'Wood',
        description: 'A useful material that can be crafted into many things',
        sellPrice: 500,
        buyPrice: 5000,
        tradeValue: 250,
        emoji: emojis.wood,
        id: 'wood',
        type: 'Craftable',
        rarity: 'Common',
        url: '',
        usable: false,
        marketable: true
    },
    {
        name: 'Pet Food',
        description: 'Required to keep your pet healthly',
        sellPrice: 0,
        buyPrice: 1000,
        tradeValue: 100,
        emoji: emojis.petFood,
        id: 'pet food',
        type: 'Collectable',
        rarity: 'Common',
        url: '',
        usable: false,
        marketable: true
    },
    {
        name: 'Ammo',
        description: 'Needed to keep your rifle loaded',
        sellPrice: 0,
        buyPrice: 100,
        tradeValue: 10,
        emoji: emojis.ammo,
        id: 'ammo',
        type: 'Tool',
        rarity: 'Common',
        url: '',
        usable: false,
        marketable: true
    },
    {
        name: 'Pet Collar',
        description: 'Lets you give your pet a name',
        sellPrice: 750000,
        buyPrice: 1000000,
        tradeValue: 500000,
        emoji: emojis.petCollar,
        id: 'pet collar',
        type: 'Collectable',
        rarity: 'Rare',
        url: '',
        usable: false,
        marketable: true
    },
]