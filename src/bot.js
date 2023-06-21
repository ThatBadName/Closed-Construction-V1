const {
  token
} = require('../config.json')
const {
  Client,
  Collection,
  GatewayIntentBits,
  ChannelType
} = require('discord.js')
const fs = require('fs')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildInvites
  ]
})

client.commands = new Collection()
client.buttons = new Collection()
client.selectMenus = new Collection()
client.commandArrayGlobal = []
client.commandArrayLocal = []

const functionFolders = fs.readdirSync('./src/functions')
for (const folder of functionFolders) {
  const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter(file => file.endsWith('.js'))
  for (const file of functionFiles) require(`./functions/${folder}/${file}`)(client)
}

client.handleEvents()
client.handleComponents()
client.handleGlobalCommands()
client.handleLocalCommands()
client.login(token)

// Expired Cooldowns
const blacklistedGuilds = require('./models/blacklistGuild')
const blacklistedUsers = require('./models/blacklistUser')
const commandCooldowns = require('./models/cooldowns')
const robCooldowns = require('./models/robCooldowns')
const robCooldownsSus = require('./models/robCooldownsSus')
const recentCommandSchema = require('./models/recentCommands')
const profileSchema = require('./models/userProfile')
const xpBoosts = require('./models/xpBoosts')
const activeDevCoinSchema = require('./models/activeDevCoins')
const robMultiSchema = require('./models/robMulti')
const awaitVoteAgainNotifSchema = require('./models/awaitVoteAgainNotif')
const passiveCooldownSchema = require('./models/passiveCooldowns')
const failedVerification = require('./models/verificationFailed')
const botSchema = require('./models/bot')
const functions = require('./commandFunctions')
const {
  colours,
  emojis,
  ticketPrice
} = require('../src/things/constants')

const checkForExpired = async () => {
  const query = {
    expires: {
      $lt: new Date()
    },
  }

  await blacklistedGuilds.deleteMany(query)
  await blacklistedUsers.deleteMany(query)
  await commandCooldowns.deleteMany(query)
  await robCooldowns.deleteMany(query)
  await robCooldownsSus.deleteMany(query)
  await recentCommandSchema.deleteMany(query)
  await activeDevCoinSchema.deleteMany(query)
  await robMultiSchema.deleteMany(query)
  await passiveCooldownSchema.deleteMany(query)
  await failedVerification.deleteMany(query)
  setTimeout(checkForExpired, 1000 * 1)
}
checkForExpired()

const checkForExpiredBoosts = async () => {
  const query = {
    expires: {
      $lt: new Date()
    },
  }

  const results = await xpBoosts.find(query)

  for (const result of results) {
    const {
      userId,
      increase
    } = result

    const userProfile = await profileSchema.findOne({
      userId: userId
    })
    if (!userProfile) continue

    if (userProfile.xpBoost - increase <= 0) {
      userProfile.xpBoost = 0;
      userProfile.save()
    } else {
      userProfile.xpBoost -= increase;
      userProfile.save()
    }

    result.delete()
  }
  setTimeout(checkForExpiredBoosts, 1000 * 1)
}
checkForExpiredBoosts()

const checkForExpiredJobs = async () => {
  const query = {
    getsFiresOn: {
      $lt: new Date()
    },
    hasBeenFired: false
  }

  const results = await profileSchema.find(query)

  for (const result of results) {
    const {
      userId,
    } = result

    const userProfile = await profileSchema.findOne({
      userId: userId
    })
    if (!userProfile) continue

    userProfile.hasBeenFired = true
    userProfile.save()
  }
  setTimeout(checkForExpiredJobs, 1000 * 1)
}
checkForExpiredJobs()

const dailyLotto = async () => {
  var date = new Date()
  var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())

  const query = {
    nextLotto: {
      $lt: new Date(now_utc)
    }
  }

  const results = await botSchema.find(query)

  for (const schema of results) {

    const guild = await client.guilds.fetch('994642021425877112')
    if (!guild) continue

    const channel = guild.channels.cache.get('1023873758433382400')
    if (!channel) continue

    const {
      lottoEntries,
      nextLotto
    } = schema
    let entriesTotal = lottoEntries

    const date = new Date()
    date.setUTCHours(36, 0, 0, 0)

    const date2 = new Date()
    date2.setUTCHours(date2.getUTCHours() + 1, 0, 0, 0)

    schema.nextUpdate = date2
    schema.nextLotto = date
    schema.lottoEntries = []
    schema.save()

    if (entriesTotal.length === 0) {
      const message = await channel.send({
        embeds: [
          new EmbedBuilder()
          .setTitle('Daily Lottery Results')
          .setColor(colours.win)
          .setDescription(`What a shame, nobody entered the lottery`)
        ]
      })
      message.crosspost()
      return
    }

    let winnerId = entriesTotal[Math.floor(Math.random() * entriesTotal.length)]
    let winnerEntries = entriesTotal.filter(v => v === winnerId).length
    let reward = Math.round(entriesTotal.length * (ticketPrice * 97) / 100)
    let differentUsers = getUnique(entriesTotal).length

    let arr = lottoEntries
    let num = 3

    const mostFrequent = (arr = [], num = 1) => {
      const map = {};
      let keys = [];
      for (let i = 0; i < arr.length; i++) {
        if (map[arr[i]]) {
          map[arr[i]]++;
        } else {
          map[arr[i]] = 1;
        }
      }
      for (let i in map) {
        keys.push(i);
      }
      keys = keys.sort((a, b) => {

          if (map[a] === map[b]) {

            if (a > b) {
              return 1;
            } else {
              return -1;
            }
          } else {
            return map[b] - map[a];
          }
        })
        .slice(0, num);
      return keys;
    };

    let spenders = []
    let topArray = mostFrequent(arr, num)
    for (i = 0; i < topArray.length; ++i) {
      let current = topArray[i]
      let entriesTop = entriesTotal.filter(v => v === current).length
      spenders.push(`<@${current}>: \`${entriesTop.toLocaleString()}\` entries`)
    }

    let userProfile = await profileSchema.findOne({
      userId: winnerId
    })
    if (!userProfile) userProfile = await profileSchema.create({
      userId: winnerId
    })

    if (userProfile.xp + 5 * winnerEntries >= userProfile.requiredXp) {
      const message = await channel.send({
        embeds: [
          new EmbedBuilder()
          .setTitle('Daily Lottery Results')
          .setColor(colours.win)
          .setDescription(`<@${winnerId}> (\`${winnerId}\`) has walked away with \`${reward.toLocaleString()}\` coins AND leveled up (gg btw)\n` +
            `\n\` - \` They paid \`${(winnerEntries * ticketPrice).toLocaleString()}\` coins (\`${winnerEntries.toLocaleString()}\` entries)\n` +
            `\` - \` Profit: \`${Math.round((reward - (winnerEntries * ticketPrice)) / (entriesTotal.length * ticketPrice) * 100).toLocaleString()}%\`` +
            `\n\n\` - \` Users: \`${differentUsers.toLocaleString()}\`\n\` - \` Total Entries: \`${entriesTotal.length.toLocaleString()}\`\n\n\` - \` Top 3 Spenders:\n${spenders.join('\n')}`
          )
        ],
        content: `<@${winnerId}>,`
      })
      message.crosspost()

      let reward2 = userProfile.coinMulti === 0 ? 5000 : Math.round(5000 / 100 * userProfile.coinMulti) + 5000
      userProfile.xp = 0
      userProfile.level = userProfile.level + 1
      userProfile.requiredXp = userProfile.requiredXp + 25
      userProfile.wallet = userProfile.wallet + reward2 + reward
      userProfile.maxBank = userProfile.maxBank + 2
      userProfile.coinMulti += Math.round(Math.random() * (5 - 1) + 1)
      userProfile.save()
      functions.createNewNotif(winnerId, `You are now **level ${userProfile.level}**. As a reward you have been given \`${reward2}\` coins`)
    } else {
      const message = await channel.send({
        embeds: [
          new EmbedBuilder()
          .setTitle('Daily Lottery Results')
          .setColor(colours.win)
          .setDescription(`<@${winnerId}> (\`${winnerId}\`) has walked away with \`${reward.toLocaleString()}\` coins\n` +
            `\n\` - \` They paid \`${(winnerEntries * ticketPrice).toLocaleString()}\` coins (\`${winnerEntries.toLocaleString()}\` entries)\n` +
            `\` - \` Profit: \`${Math.round((reward - (winnerEntries * ticketPrice)) / (entriesTotal.length * ticketPrice) * 100).toLocaleString()}%\`` +
            `\n\n\` - \` Users: \`${differentUsers.toLocaleString()}\`\n\` - \` Total Entries: \`${entriesTotal.length.toLocaleString()}\`\n\n\` - \` Top 3 Spenders:\n${spenders.join('\n')}`
          )
        ],
        content: `<@${winnerId}>,`
      })
      message.crosspost()

      userProfile.wallet += reward
      userProfile.xp += 5 * winnerEntries
      userProfile.save()
    }

    await channel.edit({
      topic: `Prize pool: ${(schema.lottoEntries.length * ticketPrice).toLocaleString()} coins • Current Entries: ${schema.lottoEntries.length.toLocaleString()} • Winner drawn <t:${Math.round(schema.nextLotto.getTime() / 1000)}:R> • Updating <t:${Math.round(schema.nextUpdate.getTime() / 1000)}:R>`
    })

  }

  setTimeout(dailyLotto, 1 * 1000)
}
dailyLotto()

const updateLotto = async () => {
  var date = new Date()
  var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())
  const query = {
    nextUpdate: {
      $lt: new Date(now_utc)
    }
  }

  const query2 = {
    nextLotto: {
      $lt: new Date(now_utc)
    }
  }

  const results = await botSchema.find(query)
  const checkIfEnd = await botSchema.find(query2)
  for (const schema of results) {
    if (checkIfEnd.length !== 0) continue
    const guild = await client.guilds.fetch('994642021425877112')
    if (!guild) continue

    const channel = guild.channels.cache.get('1023873758433382400')
    if (!channel) continue

    const {
      lottoEntries,
      nextUpdate,
      nextLotto
    } = schema

    const date = new Date()
    date.setUTCHours(date.getUTCHours() + 1, 0, 20, 0)

    schema.nextUpdate = date
    schema.save()


    await channel.edit({
      topic: `Prize pool: ${(lottoEntries.length * ticketPrice).toLocaleString()} coins • Current Entries: ${lottoEntries.length.toLocaleString()} • Winner drawn <t:${Math.round(schema.nextLotto.getTime() / 1000)}:R> • Updating <t:${Math.round(schema.nextUpdate.getTime() / 1000)}:R>`
    })
  }
  setTimeout(updateLotto, 1 * 1000)
}
updateLotto()

const market = async () => {
  var date = new Date()
  var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())

  const query = {
    nextMarket: {
      $lt: new Date(now_utc)
    }
  }

  const results = await botSchema.find(query)

  for (const result of results) {
    const marketOfferSchema = require('./models/marketDeals')
    const marketSchema = require('./models/marketplace')
    const offerList = require('./things/items/marketOffers')
    let items = require('./things/items/allItems')

    await marketOfferSchema.collection.deleteMany()

    //Create regular market
    let numberOfRegularDeals = 5
    for (i = 0; i < numberOfRegularDeals; ++i) {
      let lootTable = offerList.filter(i => i.regularMarket === true)
      
      let picked = chooseRandom(lootTable)
      
      let stock = Math.round(Math.random() * (picked.maxStock - picked.minStock) + picked.minStock)
      let discount = Math.round(Math.random() * (picked.maxDiscount - picked.minDiscount) + picked.minDiscount)
      let itemQuery = picked.id

      const search = !!items.find((value) => value.id === itemQuery)
      if (!search) continue
      const itemFound = items.find((value) => value.id === itemQuery)
      let marketValue = 0
      const itemOnMarket = await marketSchema.find({
        itemId: itemFound.id
      })

      if (itemOnMarket.length === 0) marketValue = itemFound.tradeValue
      else {
        let total = 0
        for (let i = 0; i < itemOnMarket.length; ++i) {
          total += itemOnMarket[i].listingPrice
        }
        marketValue = Math.round(total / itemOnMarket.length)
      }

      let price = Math.round(marketValue * (1 - discount / 100))
      marketOfferSchema.create({
        itemId: picked.id,
        itemName: picked.name,
        itemEmoji: picked.emoji,
        itemStock: stock,
        maxStock: stock,
        itemPrice: price,
        itemDiscount: discount,
        darkMarket: false,
        regularMarket: true,
        offerId: `marketOffer-${i + 1}`,
        number: i + 1
      })
    }

    let darkDeals = []
    let numberOfDarkDeals = 10
    for (i = 0; i < numberOfDarkDeals; ++i) {
      let lootTable = offerList.filter(i => i.vipMarket === true)
      
      let picked = chooseRandom(lootTable)
      
      let stock = Math.round(Math.random() * (picked.maxStock - picked.minStock) + picked.minStock)
      let discount = Math.round(Math.random() * (picked.maxDiscount - picked.minDiscount) + picked.minDiscount)
      let itemQuery = picked.id

      const search = !!items.find((value) => value.id === itemQuery)
      if (!search) continue
      const itemFound = items.find((value) => value.id === itemQuery)
      let marketValue = 0
      const itemOnMarket = await marketSchema.find({
        itemId: itemFound.id
      })

      if (itemOnMarket.length === 0) marketValue = itemFound.tradeValue
      else {
        let total = 0
        for (let i = 0; i < itemOnMarket.length; ++i) {
          total += itemOnMarket[i].listingPrice
        }
        marketValue = Math.round(total / itemOnMarket.length)
      }

      let price = Math.round(marketValue * (1 - discount / 100))
      darkDeals.push({
        itemId: picked.id,
        itemName: picked.name,
        itemEmoji: picked.emoji,
        itemStock: stock,
        maxStock: stock,
        itemPrice: price,
        itemDiscount: discount,
        darkMarket: true,
        regularMarket: false
      })
    }

    const guild = await client.guilds.fetch('994642021425877112') //994642021425877112 main
    if (!guild) continue

    const channel = guild.channels.cache.get('1024787826304352348') //1024787826304352348 main
    if (!channel) continue

    const message = await channel.messages.fetch('1026202274118254642') //1026202274118254642 main
    if (!message) continue

    var date = new Date()
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours() + 3, date.getUTCMinutes(), date.getUTCSeconds())

    result.nextMarket = new Date(now_utc)
    result.save()

    const embed = new EmbedBuilder()
      .setTitle('The Darkened Market')
      .setDescription(`The market will restock <t:${Math.round(result.nextMarket.getTime() / 1000)}:R>\nThis message will update <t:${Math.round(result.nextMarketUpdate.getTime() / 1000)}:R>`)
      .setColor(colours.blend)

    let buttons1 = []
    let buttons2 = []
    for (let i = 0; i < darkDeals.length; ++i) {
      marketOfferSchema.create({
        itemId: darkDeals[i].itemId,
        itemName: darkDeals[i].itemName,
        itemEmoji: darkDeals[i].itemEmoji,
        itemStock: darkDeals[i].itemStock,
        maxStock: darkDeals[i].itemStock,
        itemPrice: darkDeals[i].itemPrice,
        itemDiscount: darkDeals[i].itemDiscount,
        darkMarket: true,
        regularMarket: false,
        offerId: `offer-${i + 1}`,
        number: i + 1
      })

      embed
        .addFields({
          name: `[Offer ${i + 1}] ${darkDeals[i].itemEmoji}**${darkDeals[i].itemName}**`,
          inline: true,
          value: `` +
            `> Stock: \`${darkDeals[i].itemStock.toLocaleString()}\`/\`${darkDeals[i].maxStock.toLocaleString()}\`\n` +
            `> Price per unit: \`${darkDeals[i].itemPrice.toLocaleString()}\`\n` +
            `> Discount: \`${darkDeals[i].itemDiscount}%\``
        })
      const button = new ButtonBuilder()
        .setLabel(`Accept Offer ${i + 1}`)
        .setCustomId(`offer-${i + 1}`)
        .setStyle('Secondary')

      if (buttons1.length >= 5) buttons2.push(button)
      else buttons1.push(button)
    }

    message.edit({
      embeds: [embed],
      components: [
        new ActionRowBuilder()
        .addComponents(
          buttons1
        ),

        new ActionRowBuilder()
        .addComponents(
          buttons2
        )
      ]
    })
  }
  setTimeout(market, 1 * 1000)
}
market()

const marketUpdate = async () => {
  var date = new Date()
  var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())

  const query = {
    nextMarketUpdate: {
      $lt: new Date(now_utc)
    }
  }

  const results = await botSchema.find(query)
  for (const result of results) {
    const guild = await client.guilds.fetch('994642021425877112') //994642021425877112 main
    if (!guild) continue

    const channel = guild.channels.cache.get('1024787826304352348') //1024787826304352348 main
    if (!channel) continue

    const message = await channel.messages.fetch('1026202274118254642') //1026202274118254642 main
    if (!message) continue

    var date = new Date()
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes() + 2, date.getUTCSeconds())

    result.nextMarketUpdate = new Date(now_utc)
    result.save()

    const marketSchemaDeals = require('./models/marketDeals')
    const markets = await marketSchemaDeals.find({
      darkMarket: true
    }).sort({number: 1})
    const embed = new EmbedBuilder()
      .setTitle('The Darkened Market')
      .setDescription(`The market will restock <t:${Math.round(result.nextMarket.getTime() / 1000)}:R>\nThis message will update <t:${Math.round(result.nextMarketUpdate.getTime() / 1000)}:R>`)
      .setColor(colours.blend)

    let buttons1 = []
    let buttons2 = []

    let offerCount = markets.length
    for (let i = 0; i < offerCount; ++i) {
      embed
        .addFields({
          name: `[Offer ${i + 1}] ${markets[i].itemEmoji}**${markets[i].itemName}**`,
          inline: true,
          value: `` +
            `> Stock: \`${markets[i].itemStock.toLocaleString()}\`/\`${markets[i].maxStock.toLocaleString()}\`\n` +
            `> Price per unit: \`${markets[i].itemPrice.toLocaleString()}\`\n` +
            `> Discount: \`${markets[i].itemDiscount}%\``
        })
      const button = new ButtonBuilder()
        .setLabel(`Accept Offer ${i + 1}`)
        .setCustomId(`offer-${i + 1}`)
        .setStyle('Secondary')

      if (markets[i].itemStock === 0) button.setDisabled(true)

      if (buttons1.length >= 5) buttons2.push(button)
      else buttons1.push(button)
    }

    message.edit({
      embeds: [embed],
      components: [
        new ActionRowBuilder()
        .addComponents(
          buttons1
        ),

        new ActionRowBuilder()
        .addComponents(
          buttons2
        )
      ]
    })
  }
  setTimeout(marketUpdate, 1000)
}
marketUpdate()

const checkForNotifs = async () => {
  const query = {
    expires: {
      $lt: new Date()
    },
  }

  const resultsForNotifs = await awaitVoteAgainNotifSchema.find(query)

  for (const result of resultsForNotifs) {
    const {
      userId,
    } = result

    functions.createNewNotif(userId, `You are able to [vote again](https://top.gg/bot/994644001397428335/vote)!`)
    const userProfile = await profileSchema.findOne({
      userId: userId
    })
    if (!userProfile) continue
    userProfile.canVote = true
    userProfile.save()

    result.delete()
  }
  setTimeout(checkForNotifs, 1000 * 1)
}
checkForNotifs()

const Topgg = require("@top-gg/sdk")
const express = require("express")
const inventorySchema = require('./models/inventorySchema')
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  WebhookClient
} = require('discord.js')

const app = express()

const webhook = new Topgg.Webhook("ClosedConstruction")
app.post("/dblwebhook", webhook.listener(async (vote) => {
  const member = await client.users.fetch(vote.user)

  const checkForProfile = await profileSchema.findOne({
    userId: vote.user
  })
  const checkInv = await inventorySchema.findOne({
    userId: vote.user,
    itemId: 'cheque'
  })
  const checkInvBox = await inventorySchema.findOne({
    userId: vote.user,
    itemId: 'vote box'
  })

  const date = new Date()
  date.setHours(date.getHours() + 12)

  await awaitVoteAgainNotifSchema.create({
    userId: vote.user,
    expires: date
  })

  if (checkForProfile) {
    var today = new Date()
    if (today.getDay() == 6 || today.getDay() == 0) {
      checkForProfile.wallet += 40000
      checkForProfile.canVote = false
      checkForProfile.save()

      if (!checkInv) await inventorySchema.create({
        userId: vote.user,
        itemId: 'cheque',
        item: 'Cheque',
        amount: 3,
        emoji: emojis.cheque
      })
      else {
        checkInv.amount += 3;
        checkInv.save()
      }
      if (!checkInvBox) await inventorySchema.create({
        userId: vote.user,
        itemId: 'vote box',
        item: 'Vote Box',
        amount: 1,
        emoji: emojis.voteBox
      })
      else {
        checkInvBox.amount += 3;
        checkInvBox.save()
      }

      member.send({
        embeds: [
          new EmbedBuilder()
          .setTitle('Thanks for voting!')
          .setDescription(`You have been gifted:\n\` - \` \`40,000\` coins\n\` - \` 1x ${emojis.voteBox}Vote Box\n\` - \` 3x ${emojis.cheque}Cheques`)
          .setColor('0x' + colours.blend)
          .setFooter({
            text: `Cause it's the weekend the rewards are better`
          })
        ],
        components: [
          new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
            .setStyle('Link')
            .setLabel('Vote on Top.gg')
            .setURL('https://top.gg/bot/994644001397428335/vote')
          )
        ]
      }).catch(() => {})
    } else {
      checkForProfile.wallet += 20000
      checkForProfile.save()

      if (!checkInv) await inventorySchema.create({
        userId: vote.user,
        itemId: 'cheque',
        item: 'Cheque',
        amount: 1,
        emoji: emojis.cheque
      })
      else {
        checkInv.amount += 1;
        checkInv.save()
      }

      member.send({
        embeds: [
          new EmbedBuilder()
          .setTitle('Thanks for voting!')
          .setDescription(`You have been gifted:\n\` - \` \`20,000\` coins\n\` - \` 1x ${emojis.cheque}Cheque`)
          .setColor('0x' + colours.blend)
        ],
        components: [
          new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
            .setStyle('Link')
            .setLabel('Vote on Top.gg')
            .setURL('https://top.gg/bot/994644001397428335/vote')
          )
        ]
      }).catch(() => {})
    }
  } else {
    member.send({
      embeds: [
        new EmbedBuilder()
        .setTitle('Thanks for voting!')
        .setDescription(`If you had a bot profile we would have sent you some gifts`)
        .setColor('0x' + colours.blend)
      ],
      components: [
        new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setStyle('Link')
          .setLabel('Vote on Top.gg')
          .setURL('https://top.gg/bot/994644001397428335/vote')
        )
      ]
    }).catch(() => {})
  }
}))

app.listen(10002)

client.on('guildCreate', async (guild) => {
  const g = await client.guilds.cache.get(guild.id)?.fetch()
  const members = await g.members.fetch()
  if (guild.memberCount < 25 || members.filter(u => !u.user.bot).size <= members.filter(u => u.user.bot).size + 3) {
    const channel = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has('SendMessages'))
    let failedEmbed = false
    try {
      await channel.send({
        embeds: [
          new EmbedBuilder()
          .setTitle('I have left the server')
          .setDescription(
            'There are a few reasons that I may have left this server:\n\n\`1.\` Your server has under 25 members\n\`2.\` Your server has more bots than humans\n\`3.\` There are too many bots for the number of humans in your server' +
            '\n\nThese restrictions are in place because we are trying to get the bot verified and servers like this may get it denied. We will remove these restrictions when the bot is verified' +
            '. If you would like to still use the bot you can join the support server or use it in another server. If your server manages to not have the things listed above then feel free to reinvite the bot'
          )
          .setColor('0x' + colours.alert)
        ],
        components: [
          new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
            .setLabel('Invite Me')
            .setStyle('Link')
            .setURL('https://discord.com/oauth2/authorize?client_id=994644001397428335&permissions=412921220161&scope=bot%20applications.commands'),

            new ButtonBuilder()
            .setLabel('Support Server')
            .setStyle('Link')
            .setURL('https://discord.gg/9jFqS5H43Q')
          )
        ]
      })
    } catch {
      failedEmbed = true
    }
    if (failedEmbed === true) {
      await channel.send(
        'There are a few reasons that I may have left this server:\n\n\`1.\` Your server has under 25 members\n\`2.\` Your server has more bots than humans\n\`3.\` There are too many bots for the number of humans in your server' +
        '\n\nThese restrictions are in place because we are trying to get the bot verified and servers like this may get it denied. We will remove these restrictions when the bot is verified' +
        '. If you would like to still use the bot you can join the support server or use it in another server. If your server manages to not have the things listed above then feel free to reinvite the bot' +
        '\n\nSupport Server: https://discord.gg/9jFqS5H43Q\nBot Invite: https://discord.com/oauth2/authorize?client_id=994644001397428335&permissions=412921220161&scope=bot%20applications.commands'
      ).catch(() => {})
    }
    setTimeout(() => guild.leave(), 5000)
  }
})

function getUnique(array) {
  var unique = [];

  for (i = 0; i < array.length; i++) {
    if (unique.indexOf(array[i]) === -1) {
      unique.push(array[i]);
    }
  }
  return unique;
}



process.on("unhandledRejection", (reason, p) => {
  console.log(" [antiCrash] :: Unhandled Rejection/Catch")
  console.log(reason, p)
  //const webhookClient = new WebhookClient({
  //url: `https://discord.com/api/webhooks/1023674577374691419/Ot2AQXk_04n37gOsZNrFN935Ai3rGfCqKv5qRHHmMkT32IAsl0OPjtOSI8oOSBVuFNI0`
  //})
  //webhookClient.send({
  //embeds: [
  //new EmbedBuilder()
  //.setDescription(reason, p)
  //.setTitle('Unhandled Rejection/Catch')
  //]
  // }).catch(() => {})
})

process.on("uncaughtException", (err, origin) => {
  console.log(" [antiCrash] :: Uncaught Exception/Catch")
  console.log(err, origin)
  //const webhookClient = new WebhookClient({
  //url: `https://discord.com/api/webhooks/1023674577374691419/Ot2AQXk_04n37gOsZNrFN935Ai3rGfCqKv5qRHHmMkT32IAsl0OPjtOSI8oOSBVuFNI0`
  //})
  //webhookClient.send({
  //embeds: [
  //new EmbedBuilder()
  //.setDescription(err, origin)
  //.setTitle('Uncaught Exception/Catch')
  //]
  //}).catch(() => {})
})

process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)")
  console.log(err, origin)
  //const webhookClient = new WebhookClient({
  //url: `https://discord.com/api/webhooks/1023674577374691419/Ot2AQXk_04n37gOsZNrFN935Ai3rGfCqKv5qRHHmMkT32IAsl0OPjtOSI8oOSBVuFNI0`
  //})
  //webhookClient.send({
  //embeds: [
  // new EmbedBuilder()
  //.setDescription(err, origin)
  // .setTitle('Uncaught Exception/Catch')
  //]
  //}).catch(() => {})
})

process.on("multipleResolves", (type, promise, reason) => {
  // console.log(" [antiCrash] :: Multiple Resolves")
  // console.log(type, promise, reason)
})

function chooseRandom(lootTable) {
  let picked = null;
  let roll = Math.floor(Math.random() * 100);
  for (let i = 0, len = lootTable.length; i < len; ++i) {
    const loot = lootTable[i];
    const {
      chance
    } = loot;
    if (roll < chance) {
      picked = loot;
      return picked
    }
    roll -= chance;
  }
}