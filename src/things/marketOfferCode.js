const profileSchema = require('../models/userProfile')
const inventorySchema = require('../models/inventorySchema')
const marketOffersSchema = require('../models/marketDeals')
const {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder
} = require('discord.js')
const {
  colours
} = require('./constants')

async function offerDark(interaction) {
  const offerId = interaction.customId
  const options = await interaction.reply({
    components: [
      new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId('option1')
        .setLabel('Buy 1')
        .setStyle('Secondary'),

        new ButtonBuilder()
        .setCustomId('option2')
        .setLabel('Buy 10')
        .setStyle('Secondary'),

        new ButtonBuilder()
        .setCustomId('option3')
        .setLabel('Buy 100')
        .setStyle('Secondary')
      )
    ],
    ephemeral: true,
    fetchReply: true
  })
  const collector = await options.createMessageComponentCollector({
    time: 15000,
    type: 'Button'
  })

  let stopped = false
  const amount = {
    'option1': 1,
    'option2': 10,
    'option3': 100
  }
  collector.on('collect', async (i) => {
      stopped = true
      collector.stop()
      i.deferUpdate()
      const offer = await marketOffersSchema.findOne({
        offerId: offerId
      })
      if (!offer) return interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setDescription('This is no longer an offer on the market')
          .setColor(colours.blend)
        ],
        components: []
      })
      if (offer.itemStock === 0) return interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setDescription('This item is out of stock')
          .setColor(colours.blend)
        ],
        components: []
      })

      let profile = await profileSchema.findOne({
        userId: interaction.user.id
      })
      if (!profile) profile = await profileSchema.create({
        userId: interaction.user.id
      })
      if (profile.level < 20) return interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setTitle('You must be level 20+ to access the market')
          .setColor('0x' + colours.error)
        ],
        components: [],
        ephemeral: true
      })
    let amountOfItems = amount[i.customId]

    if (offer.itemStock < amountOfItems) amountOfItems = offer.itemStock

    if (profile.wallet < amountOfItems * offer.itemPrice) return interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setDescription('You do not have enough to buy this')
        .setColor(colours.blend)
      ],
      components: []
    })
    const checkInv = await inventorySchema.findOne({
      userId: interaction.user.id,
      itemId: offer.itemId
    })
    if (!checkInv) inventorySchema.create({
      userId: interaction.user.id,
      itemId: offer.itemId,
      amount: amountOfItems,
      item: offer.itemName,
      emoji: offer.itemEmoji
    })
    else {
      checkInv.amount += amountOfItems;
      checkInv.save()
    }
    profile.wallet -= amountOfItems * offer.itemPrice; profile.save()
    offer.itemStock -= amountOfItems; offer.save()

    interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setDescription(`You have bought ${amountOfItems}x ${offer.itemEmoji}${offer.itemName} for ${(amountOfItems * offer.itemPrice).toLocaleString()} coins`)
        .setColor(colours.blend)
      ],
      components: []
    })

  })

collector.on('end', () => {
  if (stopped === true) return
  interaction.editReply({
    embeds: [
      new EmbedBuilder()
      .setDescription('You took too long to respond')
      .setColor(colours.blend)
    ],
    components: []
  })
})
}

async function offerRegular(interaction) {
  const offerId = interaction.customId.split('|')[0]
  const offerCheck = interaction.customId.split('|')[1]
  const options = await interaction.reply({
    components: [
      new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId('option1')
        .setLabel('Buy 1')
        .setStyle('Secondary'),

        new ButtonBuilder()
        .setCustomId('option2')
        .setLabel('Buy 10')
        .setStyle('Secondary'),

        new ButtonBuilder()
        .setCustomId('option3')
        .setLabel('Buy 100')
        .setStyle('Secondary')
      )
    ],
    ephemeral: true,
    fetchReply: true
  })
  const collector = await options.createMessageComponentCollector({
    time: 15000,
    type: 'Button'
  })

  let stopped = false
  const amount = {
    'option1': 1,
    'option2': 10,
    'option3': 100
  }
  collector.on('collect', async (i) => {
    stopped = true
    collector.stop()
    i.deferUpdate()
    const offer = await marketOffersSchema.findOne({
      offerId: offerId
    })
    if (!offer) return interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setDescription('This is no longer an offer on the market')
        .setColor(colours.blend)
      ],
      components: []
    })
    if (offer.itemStock === 0) return interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setDescription('This item is out of stock')
        .setColor(colours.blend)
      ],
      components: []
    })
    if (offer.itemName + offer.itemDiscount !== offerCheck) return interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setDescription('This market message is no longer valid')
        .setColor(colours.blend)
      ],
      components: []
    })

    let profile = await profileSchema.findOne({
      userId: interaction.user.id
    })
    if (!profile) profile = await profileSchema.create({
      userId: interaction.user.id
    })
    if (profile.level < 20) return interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setTitle('You must be level 20+ to access the market')
        .setColor('0x' + colours.error)
      ],
      components: [],
      ephemeral: true
    })

    let amountOfItems = amount[i.customId]

    if (offer.itemStock < amountOfItems) amountOfItems = offer.itemStock

    if (profile.wallet < amountOfItems * offer.itemPrice) return interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setDescription('You do not have enough to buy this')
        .setColor(colours.blend)
      ],
      components: []
    })
    const checkInv = await inventorySchema.findOne({
      userId: interaction.user.id,
      itemId: offer.itemId
    })
    if (!checkInv) inventorySchema.create({
      userId: interaction.user.id,
      itemId: offer.itemId,
      amount: amountOfItems,
      item: offer.itemName,
      emoji: offer.itemEmoji
    })
    else {
      checkInv.amount += amountOfItems;
      checkInv.save()
    }
    profile.wallet -= amountOfItems * offer.itemPrice;
    profile.save()
    offer.itemStock -= amountOfItems;
    offer.save()

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setDescription(`You have bought ${amountOfItems}x ${offer.itemEmoji}${offer.itemName} for ${(amountOfItems * offer.itemPrice).toLocaleString()} coins`)
        .setColor(colours.blend)
      ],
      components: []
    }).then(async () => {
      const botSchema = require('../models/bot')
      const bot = await botSchema.findOne()
      const offers = await marketOffersSchema.find({
        regularMarket: true
      }).sort({
        number: 1
      })
      const embed = new EmbedBuilder()
        .setTitle('The Market - Offers')
        .setDescription(`The market will restock <t:${Math.round(bot.nextMarket.getTime() / 1000)}:R>`)
        .setColor(colours.blend)

      let buttons1 = []
      let buttons2 = []

      let offerCount = offers.length
      for (let i = 0; i < offerCount; ++i) {
        embed
          .addFields({
            name: `Offer ${i + 1}`,
            inline: true,
            value: `${offers[i].itemEmoji}**${offers[i].itemName}**\n` +
              `> Stock: \`${offers[i].itemStock.toLocaleString()}\`/\`${offers[i].maxStock.toLocaleString()}\`\n` +
              `> Price per unit: \`${offers[i].itemPrice.toLocaleString()}\`\n` +
              `> Discount: \`${offers[i].itemDiscount}%\``
          })
        const button = new ButtonBuilder()
          .setLabel(`Accept Offer ${i + 1}`)
          .setCustomId(`marketOffer-${i + 1}`)
          .setStyle('Secondary')

        if (offers[i].itemStock === 0) button.setDisabled(true)

        if (buttons1.length >= 5) buttons2.push(button)
        else buttons1.push(button)
      }

      interaction.message.edit({
        embeds: [embed],
        components: [
          new ActionRowBuilder()
          .addComponents(
            buttons1
          )
        ],
        fetchReply: true
      })
    })
  })

  collector.on('end', () => {
    if (stopped === true) return
    interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setDescription('You took too long to respond')
        .setColor(colours.blend)
      ],
      components: []
    })
  })
}

module.exports = {
  offerDark,
  offerRegular
}