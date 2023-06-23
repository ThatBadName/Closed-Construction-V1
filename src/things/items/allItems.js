const { emojis } = require('../constants')

module.exports = [{
        name: 'Cheese',
        description: 'It\'s just a block of cheese',
        sellPrice: 500,
        buyPrice: 0,
        tradeValue: 750,
        emoji: emojis.cheese,
        id: 'cheese',
        type: 'Sellable',
        rarity: 'Common',
        url: 'https://imgur.com/aF9VMiv.png',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Vote Box',
        description: 'Get some extra items when you vote at the weekend',
        sellPrice: 0,
        buyPrice: 0,
        tradeValue: 1000,
        emoji: emojis.voteBox,
        id: 'vote box',
        type: 'Loot Box',
        rarity: 'Common',
        url: 'https://i.imgur.com/ZkskRyn.png',
        craftable: false,
        usable: true,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Developer Box',
        description: 'Get them rare items',
        sellPrice: 0,
        buyPrice: 0,
        tradeValue: 75000000,
        emoji: emojis.devBox,
        id: 'developer box',
        type: 'Loot Box',
        rarity: 'Insane',
        url: 'https://i.imgur.com/TjeGl7D.png',
        craftable: false,
        usable: true,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'XP Coin',
        description: 'This coin gives you a 50% XP boost for 1 hour',
        sellPrice: 40000,
        buyPrice: 500000,
        tradeValue: 1400000,
        emoji: emojis.xpCoin,
        id: 'xp coin',
        type: 'Power-Up',
        rarity: 'Uncommon',
        url: 'https://imgur.com/OjgbjtL.png',
        craftable: false,
        usable: true,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'KSchlatt Coin',
        description: 'A Coin of KSchlatt\'s pfp given by the devs',
        sellPrice: 0,
        buyPrice: 0,
        tradeValue: 1000000,
        emoji: emojis.schlattCoin,
        id: 'kschlatt coin',
        type: 'Collectable',
        rarity: 'Unfound',
        url: 'https://imgur.com/CN190J0.png',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Bad Coin',
        description: 'A dev item. If you own this you are legendary',
        sellPrice: 0,
        buyPrice: 0,
        tradeValue: 100000000,
        emoji: emojis.badCoin,
        id: 'bad coin',
        type: 'Collectable',
        rarity: 'Unfound',
        url: 'https://imgur.com/ktTmVOY.png',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 100
    },
    {
        name: 'Funny dog',
        description: 'A Dog with mayo on its head',
        sellPrice: 0,
        buyPrice: 0,
        tradeValue: 1500000,
        emoji: emojis.funnyDog,
        id: 'funny dog',
        type: 'Collectable',
        rarity: 'Rare',
        url: 'https://imgur.com/toqw5H2.png',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Shovel',
        description: 'Allows you to dig',
        sellPrice: 100,
        buyPrice: 15000,
        tradeValue: 14000,
        emoji: emojis.shovel,
        id: 'shovel',
        type: 'Tool',
        rarity: 'Common',
        url: 'https://imgur.com/kyYulbe.png',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Dev Coin',
        description: 'A coin from the devs. Why not use it?',
        sellPrice: 0,
        buyPrice: 0,
        tradeValue: 1000000,
        emoji: emojis.devCoin,
        id: 'dev coin',
        type: 'Collectable',
        rarity: 'Rare',
        url: 'https://imgur.com/VT0PNjk.png',
        craftable: false,
        usable: true,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Cheque',
        description: 'A handy little cheque that will give you an extra bit of bank space',
        sellPrice: 0,
        buyPrice: 50000,
        tradeValue: 50000,
        emoji: emojis.cheque,
        id: 'cheque',
        type: 'Power-Up',
        rarity: 'Common',
        url: 'https://imgur.com/ziHIdlX.png',
        craftable: false,
        usable: true,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Scout',
        description: 'A simple image of scout',
        sellPrice: 0,
        buyPrice: 0,
        tradeValue: 2500000,
        emoji: emojis.scout,
        id: 'scout',
        type: 'Power-Up',
        rarity: 'Rare',
        url: 'https://imgur.com/AmdBWTP.png',
        craftable: false,
        usable: true,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Rifle',
        description: 'Get one of these and go out to hunt',
        sellPrice: 10000,
        buyPrice: 20000,
        tradeValue: 15000,
        emoji: emojis.rifle,
        id: 'rifle',
        type: 'Tool',
        rarity: 'Common',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Rocket Fuel',
        description: 'Load up your rocket and fly off to a new planet',
        sellPrice: 0,
        buyPrice: 0,
        tradeValue: 10000,
        emoji: emojis.rocketFuel,
        id: 'rocket fuel',
        type: 'Craftable',
        rarity: 'Uncommon',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Rocket',
        description: 'Needed to get to new planets',
        sellPrice: 0,
        buyPrice: 0,
        tradeValue: 100000,
        emoji: emojis.rocket,
        id: 'rocket',
        type: 'Tool',
        rarity: 'Rare',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Super Computer',
        description: 'The brains for your rocket',
        sellPrice: 0,
        buyPrice: 0,
        tradeValue: 100000,
        emoji: emojis.superComputer,
        id: 'super computer',
        type: 'Craftable',
        rarity: 'Rare',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Space Goo',
        description: 'A strange, sticky substance. It smells. Found from launching a rocket',
        sellPrice: 10000,
        buyPrice: 0,
        tradeValue: 10000,
        emoji: emojis.spaceGoo,
        id: 'space goo',
        type: 'Sellable',
        rarity: 'Uncommon',
        url: 'https://imgur.com/BtPuUuT.png',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Dark Space Goo',
        description: 'A strange, sticky substance. It smells. Found from launching a rocket',
        sellPrice: 0,
        buyPrice: 0,
        tradeValue: 50000,
        emoji: emojis.darkSpaceGoo,
        id: 'dark space goo',
        type: 'Sellable',
        rarity: 'Uncommon',
        url: 'https://i.imgur.com/ACsqEq2.png',
        craftable: true,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98,
        itemsToCraft: [
            {
                itemId: 'space goo',
                itemAmount: 1,
                itemName: 'Space Goo',
                itemEmoji: emojis.spaceGoo
            },
            {
                itemId: 'dark essence',
                itemAmount: 3,
                itemName: 'Dark Essence',
                itemEmoji: emojis.darkEssence
            }
        ]
    },
    {
        name: 'Plasma',
        description: 'Used to make weapons',
        sellPrice: 0,
        buyPrice: 0,
        tradeValue: 40000,
        emoji: emojis.plasma,
        id: 'plasma',
        type: 'Craftable',
        rarity: 'Rare',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Air',
        description: 'How the...',
        sellPrice: 100,
        buyPrice: 0,
        tradeValue: 1000,
        emoji: emojis.air,
        id: 'air',
        type: 'Craftable',
        rarity: 'Common',
        url: 'https://imgur.com/y1Ev5am.gif',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Metal',
        description: 'Used to craft a rocket',
        sellPrice: 1000,
        buyPrice: 10000,
        tradeValue: 11000,
        emoji: emojis.metal,
        id: 'metal',
        type: 'Craftable',
        rarity: 'Common',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Wood',
        description: 'A useful material that can be crafted into many things',
        sellPrice: 500,
        buyPrice: 5000,
        tradeValue: 3000,
        emoji: emojis.wood,
        id: 'wood',
        type: 'Craftable',
        rarity: 'Common',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Plastic',
        description: 'An item found from fishing',
        sellPrice: 100,
        buyPrice: 0,
        tradeValue: 150,
        emoji: emojis.plastic,
        id: 'plastic',
        type: 'Craftable',
        rarity: 'Common',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Tape',
        description: 'Found from digging, used to tape things together', //Make it so you can find while digging
        sellPrice: 200,
        buyPrice: 0,
        tradeValue: 250,
        emoji: emojis.tape,
        id: 'tape',
        type: 'Craftable',
        rarity: 'Uncommon',
        url: 'https://imgur.com/ivNgi2i.png',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Glue',
        description: 'Used to stick stuff to other stuff. Found in the ground',//Put in dig loot table
        sellPrice: 200,
        buyPrice: 0,
        tradeValue: 250,
        emoji: emojis.glue,
        id: 'glue',
        type: 'Craftable',
        rarity: 'Uncommon',
        url: 'https://imgur.com/cCrzLe8.png',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'String',
        description: 'Used to craft a space suit',
        sellPrice: 100,
        buyPrice: 0,
        tradeValue: 200,
        emoji: emojis.string,
        id: 'string',
        type: 'Craftable',
        rarity: 'Common',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Control Unit',
        description: 'Necessary for making sure your rocket stays on course',
        sellPrice: 0,
        buyPrice: 0,
        tradeValue: 10000,
        emoji: emojis.controlUnit,
        id: 'control unit',
        type: 'Tool',
        rarity: 'Rare',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Space Suit',
        description: 'Required to go onto other planets',
        sellPrice: 0,
        buyPrice: 0,
        tradeValue: 1000,
        emoji: emojis.spaceSuit,
        id: 'space suit',
        type: 'Collectable',
        rarity: 'Uncommon',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Axe',
        description: 'Wanna cut down a tree? You need one of these',
        sellPrice: 5000,
        buyPrice: 10000,
        tradeValue: 7500,
        emoji: emojis.axe,
        id: 'axe',
        type: 'Tool',
        rarity: 'Common',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Pickaxe',
        description: 'To go mining for minerals this could be helpful',
        sellPrice: 5000,
        buyPrice: 15000,
        tradeValue: 13000,
        emoji: emojis.pickaxe,
        id: 'pickaxe',
        type: 'Tool',
        rarity: 'Common',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Pet Food',
        description: 'Required to keep your pet healthly',
        sellPrice: 0,
        buyPrice: 1000,
        tradeValue: 1500,
        emoji: emojis.petFood,
        id: 'pet food',
        type: 'Collectable',
        rarity: 'Common',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Ammo',
        description: 'Needed to keep your rifle loaded',
        sellPrice: 0,
        buyPrice: 100,
        tradeValue: 100,
        emoji: emojis.ammo,
        id: 'ammo',
        type: 'Tool',
        rarity: 'Common',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Camera',
        description: 'Found while fishing. Doesn\'t work so might aswell sell it',
        sellPrice: 400,
        buyPrice: 0,
        tradeValue: 450,
        emoji: emojis.camera,
        id: 'camera',
        type: 'Sellable',
        rarity: 'Uncommon',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Rubbish',
        description: 'A bag of smelly rubbish',
        sellPrice: 200,
        buyPrice: 0,
        tradeValue: 201,
        emoji: emojis.rubbish,
        id: 'rubbish',
        type: 'Sellable',
        rarity: 'Common',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Squid',
        description: 'Tasty food + Hungry customers = Money',
        sellPrice: 100,
        buyPrice: 0,
        tradeValue: 105,
        emoji: emojis.squid,
        id: 'squid',
        type: 'Sellable',
        rarity: 'Common',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Fish',
        description: 'Fish and chips.',
        sellPrice: 100,
        buyPrice: 0,
        tradeValue: 150,
        emoji: emojis.fish,
        id: 'fish',
        type: 'Sellable',
        rarity: 'Common',
        url: 'https://imgur.com/v3h1AZU.png',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Duck',
        description: 'Why do so many people want a pet duck?',
        sellPrice: 100,
        buyPrice: 0,
        tradeValue: 150,
        emoji: emojis.duck,
        id: 'duck',
        type: 'Sellable',
        rarity: 'Common',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Snake',
        description: 'A bigger worm',
        sellPrice: 100,
        buyPrice: 0,
        tradeValue: 150,
        emoji: emojis.snake,
        id: 'snake',
        type: 'Sellable',
        rarity: 'Common',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Alien',
        description: 'Probably hopped onto your rocket while going through space. Why does it sell?',
        sellPrice: 1000,
        buyPrice: 0,
        tradeValue: 1500,
        emoji: emojis.alien,
        id: 'alien',
        type: 'Sellable',
        rarity: 'Uncommon',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Fishing Rod',
        description: 'Used to go fishing in the river. Only helpfull on planets with water',
        sellPrice: 4000,
        buyPrice: 10000,
        tradeValue: 14000,
        emoji: emojis.fishingRod,
        id: 'rod',
        type: 'Tool',
        rarity: 'Common',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Pet Collar',
        description: 'Lets you give your pet a name',
        sellPrice: 750000,
        buyPrice: 1000000,
        tradeValue: 800000,
        emoji: emojis.petCollar,
        id: 'pet collar',
        type: 'Collectable',
        rarity: 'Rare',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Meteor',
        description: 'Found while traveling through space',
        sellPrice: 10000,
        buyPrice: 0,
        tradeValue: 11000,
        emoji: emojis.meteor,
        id: 'meteor',
        type: 'Sellable',
        rarity: 'Uncommon',
        url: '',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Berries',
        description: 'You might get a good buff.... Or a bad one',
        sellPrice: 12000,
        buyPrice: 40000,
        tradeValue: 40000,
        emoji: emojis.berries,
        id: 'berries',
        type: 'Collectable',
        rarity: 'Uncommon',
        url: 'https://imgur.com/IifsgUx.png',
        craftable: false,
        usable: true,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Minerals',
        description: 'Can be sold for a hefty sum of cash',
        sellPrice: 6000,
        buyPrice: 0,
        tradeValue: 6500,
        emoji: emojis.minerals,
        id: 'minerals',
        type: 'Sellable',
        rarity: 'Uncommon',
        url: 'https://imgur.com/7gROPNF.png',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Rocks',
        description: 'Found while mining',
        sellPrice: 100,
        buyPrice: 0,
        tradeValue: 150,
        emoji: emojis.rocks,
        id: 'rocks',
        type: 'Sellable',
        rarity: 'Common',
        url: 'https://imgur.com/yOxqj2t.png',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Gift Box',
        description: 'Can be used to gift items and coins to users',
        sellPrice: 0,
        buyPrice: 900000,
        tradeValue: 950000,
        emoji: emojis.giftBox,
        id: 'gift box',
        type: 'Special',
        rarity: 'Rare',
        url: 'https://i.imgur.com/1n07FtR.png',
        craftable: true,
        usable: true,
        marketable: true,
        taxSell: 98,
        taxBuy: 98,
        itemsToCraft: [
            {
                itemId: 'plastic',
                itemAmount: 6,
                itemName: 'Plastic',
                itemEmoji: emojis.plastic
            },
            {
                itemId: 'glue',
                itemAmount: 2,
                itemName: 'Glue',
                itemEmoji: emojis.glue
            },
            {
                itemId: 'tape',
                itemAmount: 2,
                itemName: 'Tape',
                itemEmoji: emojis.tape
            }
        ]
    },
    {
        name: 'iHate Coin',
        description: 'Worth an incredible amount of cheese',
        sellPrice: 3000000,
        buyPrice: 0,
        tradeValue: 3500000,
        emoji: emojis.iHateCoin,
        id: 'ihate coin',
        type: 'Collectable',
        rarity: 'Super Rare',
        url: 'https://i.imgur.com/q7QI49L.png',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Battery',
        description: 'Used to super charge some items',
        sellPrice: 10000,
        buyPrice: 0,
        tradeValue: 10000,
        emoji: emojis.battery,
        id: 'battery',
        type: 'Craftable',
        rarity: 'Rare',
        url: 'https://i.imgur.com/MDz8Pn0.gif',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Charged XP Coin',
        description: 'Get an INSANE XP boost for a small amount of time',
        sellPrice: 70000,
        buyPrice: 0,
        tradeValue: 1000000,
        emoji: emojis.chargedXpCoin,
        id: 'charged xp coin',
        type: 'Craftable',
        rarity: 'Rare',
        url: 'https://imgur.com/i3T7KG7.png',
        craftable: true,
        usable: true,
        marketable: true,
        taxSell: 98,
        taxBuy: 98,
        itemsToCraft: [
            {
                itemId: 'xp coin',
                itemAmount: 1,
                itemName: 'XP Coin',
                itemEmoji: emojis.xpCoin
            },
            {
                itemId: 'battery',
                itemAmount: 3,
                itemName: 'Battery',
                itemEmoji: emojis.battery
            }
        ]
    },
    {
        name: 'Splinter Coin',
        description: 'Coin for the pog host and bot',
        sellPrice: 2000000,
        buyPrice: 3000000,
        tradeValue: 1500000,
        emoji: emojis.splinter,
        url: 'https://imgur.com/AijsOdE.png',
        id: 'splinter coin',
        type: 'Collectable',
        rarity: 'Rare',
        craftable: false,
        usable: true,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Dark Charged XP Coin',
        description: 'Get an INSANE XP boost for a small amount of time',
        sellPrice: 0,
        buyPrice: 0,
        tradeValue: 1500000,
        emoji: emojis.darkChargedXpCoin,
        id: 'dark charged xp coin',
        type: 'Collectable',
        rarity: 'Very Rare',
        url: 'https://imgur.com/BGnO95s.png',
        craftable: true,
        usable: true,
        marketable: true,
        taxSell: 98,
        taxBuy: 98,
        itemsToCraft: [
            {
                itemId: 'charged xp coin',
                itemAmount: 1,
                itemName: 'Charged XP Coin',
                itemEmoji: emojis.chargedXpCoin
            },
            {
                itemId: 'dark essence',
                itemAmount: 3,
                itemName: 'Dark Essence',
                itemEmoji: emojis.darkEssence
            }
        ]
    },
    {
        name: 'Dark Essence',
        description: 'Used to transform items into a darker version',
        sellPrice: 0,
        buyPrice: 0,
        tradeValue: 5000000,
        emoji: emojis.darkEssence,
        url: 'https://i.imgur.com/mm1CWAh.png',
        id: 'dark essence',
        type: 'Craftable',
        rarity: 'Rare',
        craftable: false,
        usable: false,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
    {
        name: 'Spellbound Berries',
        description: 'Have a higher chance of a good effect',
        sellPrice: 0,
        buyPrice: 0,
        tradeValue: 4500000,
        emoji: emojis.spellboundBerries,
        url: 'https://i.imgur.com/9DqvlF9.png',
        id: 'spellbound berries',
        type: 'Power-Up',
        rarity: 'Rare',
        craftable: false,
        usable: true,
        marketable: true,
        taxSell: 98,
        taxBuy: 98
    },
]