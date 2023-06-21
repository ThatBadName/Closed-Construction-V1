const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder
} = require("discord.js");
const functions = require('../../commandFunctions');
const {
  colours
} = require("../../things/constants");
const allItems = require('../../things/items/allItems')
const inventorySchema = require('../../models/inventorySchema')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('craft')
    .setDMPermission(false)
    .setDescription('Craft items')
    .addStringOption(option =>
      option.setName('item')
      .setDescription('The item to craft')
      .setRequired(true)
      .setAutocomplete(true)
      .setMaxLength(25)
    )

    .addIntegerOption(option =>
      option.setName('amount')
      .setDescription('The amount of the item to craft')
      .setMinValue(1)
      .setRequired(false)
    ),

  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true)

    if (focusedOption.name === 'item') {
      let items = allItems.filter(item => item.craftable === true)
      let focusedValue = interaction.options.getFocused()
      let choices = items.map(i => `${i.name},${i.id}`).sort()
      let filtered = choices.filter((choice) =>
        choice.includes(focusedValue)
      ).slice(0, 25)
      await interaction.respond(
        filtered.map((choice) => ({
          name: choice.split(',')[0],
          value: choice.split(',')[1]
        }))
      )
    }
  },

  async execute(interaction, client) {
    const blks = await functions.blacklistCheck(interaction.user.id, interaction.guild.id, interaction)
    if (blks === true) return
    const main = await functions.checkMaintinance(interaction)
    if (main === true) return
    const cldn = await functions.cooldownCheck(interaction.user.id, 'craft', 3, interaction)
    if (cldn === true) return

    await interaction.deferReply()

    let itemQuery = interaction.options.getString('item')
    itemQuery = itemQuery.toLowerCase()
    let amount = interaction.options.getInteger('amount') || 1
    if (amount < 1) amount = 1

    functions.createRecentCommand(interaction.user.id, 'craft', `ITEM: ${itemQuery} | AMOUNT: ${amount}`, interaction)

    const search = !!allItems.find((value) => value.id === itemQuery)
    if (!search) return interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setTitle('I could not find that item')
        .setColor('0x' + colours.error)
      ]
    })
    const itemFound = allItems.find((value) => value.id === itemQuery)
    if (itemFound.craftable === false) return interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setTitle('That item cannot be craftted')
        .setColor('0x' + colours.error)
      ]
    })

    let itemsNeeded = []
    for (let i = 0; i < itemFound.itemsToCraft.length; ++i) {
      let current = itemFound.itemsToCraft[i]
      itemsNeeded.push(current.itemAmount + '|' + current.itemId)
      let check = await inventorySchema.findOne({
        userId: interaction.user.id,
        itemId: current.itemId
      })
      if (!check || check.amount < current.itemAmount * amount) {
        let amountInInv
        if (check) amountInInv = check.amount
        else amountInInv = 0

        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
            .setTitle('You do not have enough to craft this')
            .setDescription(`To craft this item you need ${(check ? current.itemAmount - amountInInv : current.itemAmount).toLocaleString()} more ${current.itemEmoji}${current.itemName}`)
            .setColor(colours.error)
          ]
        })
      }
    }

    const message = await interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setColor(colours.blend)
        .setDescription(
          `You are about to craft ${amount}x ${itemFound.emoji}${itemFound.name} using\n` +
          `${itemFound.itemsToCraft.map(i => `\` - \` ${i.itemAmount}x ${i.itemEmoji}${i.itemName}`).join('\n')}`
        )
      ],
      components: [
        new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId('confirm')
          .setLabel('Confirm')
          .setStyle('Success'),

          new ButtonBuilder()
          .setCustomId('cancel')
          .setLabel('Cancel')
          .setStyle('Danger')
        )
      ],
      fetchReply: true
    })

    const collector = await message.createMessageComponentCollector({
      time: 30000,
      type: 'Button'
    })

    let collected = false
    collector.on('collect', async (i) => {
      if (i.user.id !== interaction.user.id) return i.reply({
        embeds: [
          new EmbedBuilder()
          .setColor(colours.error)
          .setDescription('This is not for you')
        ],
        ephemeral: true
      })

      collected = true
      if (i.customId === 'confirm') {
        for (let i = 0; i < itemsNeeded.length; ++i) {
          let current = itemsNeeded[i]
          const check = await inventorySchema.findOne({
            userId: interaction.user.id,
            itemId: current.split('|')[1]
          })
          if (check.amount - current.split('|')[0] === 0) check.delete()
          else check.amount -= current.split('|')[0];
          check.save()
        }

        const check = await inventorySchema.findOne({
          userId: interaction.user.id,
          itemId: itemFound.id
        })
        if (check) {
          check.amount += amount;
          check.save()
        } else await inventorySchema.create({
          userId: interaction.user.id,
          itemId: itemFound.id,
          emoji: itemFound.emoji,
          item: itemFound.name,
          amount: amount
        })

        interaction.editReply({
          embeds: [
            new EmbedBuilder()
            .setTitle('Item crafted')
            .setColor(colours.blend)
            .setDescription(
              `You have crafted ${amount}x ${itemFound.emoji}${itemFound.name} using\n` +
              `${itemFound.itemsToCraft.map(i => `\` - \` ${i.itemAmount}x ${i.itemEmoji}${i.itemName}`).join('\n')}`
            )
          ],
          components: []
        })
      } else if (i.customId === 'cancel') {
        collector.stop()
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
            .setColor(colours.blend)
            .setDescription('Canceled')
          ],
          components: []
        })
      }
    })
    collector.on('end', () => {
      if (collected === true) return
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
          .setColor(colours.blend)
          .setDescription('You took too long to respond')
        ],
        components: []
      })
    })

  }
}