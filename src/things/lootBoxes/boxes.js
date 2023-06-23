const { emojis } = require('../../things/constants')

module.exports = [{
  id: 'vote box',
  name: 'Vote Box',
  description: 'Get some extra items when you vote at the weekend',
  emoji: emojis.voteBox,
  url: 'https://i.imgur.com/ZkskRyn.png',
  maxItems: 6,
  minItems: 2,
  maxCoins: 20000,
  minCoins: 1,
  possibleLoot: [{
    id: 'cheese',
    name: 'Cheese',
    emoji: emojis.cheese,
    chance: 20,
    max: 20,
    min: 1
  },
  {
    id: 'berries',
    name: 'Berries',
    emoji: emojis.berries,
    chance: 10,
    max: 3,
    min: 1
  },
  {
    id: 'ammo',
    name: 'Ammo',
    emoji: emojis.ammo,
    chance: 5,
    max: 100,
    min: 1
  },
  {
    id: 'cheque',
    name: 'Cheque',
    emoji: emojis.cheque,
    chance: 10,
    max: 5,
    min: 1
  },
  {
    id: 'dev coin',
    name: 'Dev Coin',
    emoji: emojis.devCoin,
    chance: 2.5,
    max: 1,
    min: 1
  },
  {
    id: 'xp coin',
    name: 'XP Coin',
    emoji: emojis.xpCoin,
    chance: 0.5,
    max: 1,
    min: 1
  },
  {
    id: 'gift box',
    name: 'Gift Box',
    emoji: emojis.giftBox,
    chance: 0.99,
    max: 1,
    min: 1
  },
  {
    id: 'funny dog',
    name: 'Funny Dog',
    emoji: emojis.funnyDog,
    chance: 0.01,
    max: 1,
    min: 1
  },
  {
    id: 'plastic',
    name: 'Plastic',
    emoji: emojis.plastic,
    chance: 10,
    max: 10,
    min: 1
  },
  {
    id: 'rocks',
    name: 'Rocks',
    emoji: emojis.rocks,
    chance: 7,
    max: 4,
    min: 1
  },
  {
    id: 'minerals',
    name: 'Minerals',
    emoji: emojis.minerals,
    chance: 5,
    max: 3,
    min: 1
  },
  {
    id: 'wood',
    name: 'Wood',
    emoji: emojis.wood,
    chance: 9,
    max: 4,
    min: 1
  },
  {
    id: 'snake',
    name: 'Snake',
    emoji: emojis.snake,
    chance: 5,
    max: 2,
    min: 1
  },
  {
    id: 'space suit',
    name: 'Space Suit',
    emoji: emojis.spaceSuit,
    chance: 5,
    max: 1,
    min: 1
  },
  {
    id: 'nothing',
    name: 'Nothing',
    emoji: emojis.nothing,
    chance: 10,
    max: 0,
    min: 0
  }]
},
{
  id: 'developer box',
  name: 'Developer Box',
  description: 'Get them rare items',
  emoji: emojis.devBox,
  url: 'https://i.imgur.com/TjeGl7D.png',
  maxItems: 1,
  minItems: 1,
  maxCoins: 0,
  minCoins: 0,
  possibleLoot: [{
    id: 'kschlatt coin',
    name: 'KSchlatt Coin',
    emoji: emojis.schlattCoin,
    chance: 23,
    max: 1,
    min: 1
  },
  {
    id: 'bad coin',
    name: 'Bad Coin',
    emoji: emojis.badCoin,
    chance: 10,
    max: 1,
    min: 1
  },
  {
    id: 'vote box',
    name: 'Vote Box',
    emoji: emojis.voteBox,
    chance: 23,
    max: 1,
    min: 1
  }, {
    id: 'funny dog',
    name: 'Funny Dog',
    emoji: emojis.funnyDog,
    chance: 21,
    max: 1,
    min: 1
  }, {
    id: 'gift box',
    name: 'Gift Box',
    emoji: emojis.giftBox,
    chance: 23,
    max: 1,
    min: 1
  }]
}]