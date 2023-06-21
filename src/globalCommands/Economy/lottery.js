const {
  SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder
} = require('discord.js')
const profileSchema = require('../../models/userProfile')
const botSchema = require('../../models/bot')
const functions = require('../../commandFunctions')
const {
  colours,
  ticketPrice
} = require('../../things/constants')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lottery')
    .setDMPermission(false)
    .setDescription(`Enter the lottery for a chance to win`)
    .addStringOption(option => 
      option.setName('tickets')
        .setDescription('How many tickets do you want to buy')
        .setMinLength(1)
        .setMaxLength(10)
        .setRequired(true)
    ),

  async execute(interaction) {
    const blks = await functions.blacklistCheck(interaction.user.id, interaction.guild.id, interaction)
    if (blks === true) return
    const main = await functions.checkMaintinance(interaction)
    if (main === true) return
    const cldn = await functions.cooldownCheck(interaction.user.id, 'lottery', 5, interaction)
    if (cldn === true) return

    await interaction.deferReply()

    let entries = interaction.options.getString('tickets')
    if (entries < 1 || !Number.isInteger(Number(entries))) {
      if (entries && entries.toLowerCase().includes('k')) {
        const value = entries.replace(/k/g, '');
        if (!Number.isInteger(Number(value * 1000)) || isNaN(value * 1000)) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
              .setTitle('You can only buy a whole number of tickets')
              .setColor('0x' + colours.error)
            ],
            ephemeral: true
          })
        } else {
          entries = value * 1000;
        }
      } else if (entries && entries.toLowerCase().includes('m')) {
        const value = entries.replace(/m/g, '');
        if (!Number.isInteger(Number(value * 1000000)) || isNaN(value * 1000000)) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
              .setTitle('You can only buy a whole number of tickets')
              .setColor('0x' + colours.error)
            ],
            ephemeral: true
          })
        } else {
          entries = value * 1000000;
        }
      } else {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
            .setTitle('You can only buy a whole number of tickets')
            .setColor('0x' + colours.error)
          ],
          ephemeral: true
        })
      }
    }

    if (entries > 1000000) entries = 1000000

    const payment = entries * ticketPrice
    const confirmMessage = await interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setTitle(`Buying ${parseInt(entries).toLocaleString()} lottery tickets`)
        .setColor(colours.blend)
        .setDescription(`Are you sure you want to buy \`${parseInt(entries).toLocaleString()}x\` lottery tickets for \`${payment.toLocaleString()}\` coins`)
      ],
      components: [
        new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId('confirm')
          .setLabel('Buy tickets')
          .setStyle('Success'),

          new ButtonBuilder()
          .setCustomId('cancel')
          .setLabel('Cancel')
          .setStyle('Danger')
        )
      ],
      fetchReply: true
    })

    const collector = await confirmMessage.createMessageComponentCollector({
      type: 'Button',
      time: 20000
    })

    let canceled = false
    collector.on('collect', async(i) => {
      if (i.user.id !== interaction.user.id) return i.reply({
        embeds: [
          new EmbedBuilder()
          .setTitle('This is not for you')
          .setColor(colours.error)
        ],
        ephemeral: true
      })
      i.deferUpdate()

      if (i.customId === 'confirm') {
        canceled = true
        collector.stop()
        let userProfile = await profileSchema.findOne({
          userId: interaction.user.id
        })
        if (!userProfile) userProfile = await profileSchema.create({
          userId: interaction.user.id
        })

        if (payment > userProfile.wallet) return confirmMessage.edit({
          embeds: [
            new EmbedBuilder()
            .setTitle('You do not have enough to buy this')
            .setColor(colours.blend)
          ],
          components: []
        })

        let bot = await botSchema.findOne()
        if (!bot) bot = await botSchema.create()

        for (let i = 0; i < entries; ++i) {
          bot.lottoEntries.push(interaction.user.id)
        }
        bot.save()

        userProfile.wallet -= payment
        userProfile.save()

        functions.createRecentCommand(interaction.user.id, `lottery`, `TICKETS: ${entries}`, interaction, false, false)
        confirmMessage.edit({
          embeds: [
            new EmbedBuilder()
            .setColor(colours.blend)
            .setTitle('Tickets bought')
            .setDescription(`You have bought \`${parseInt(entries).toLocaleString()}x\` lottery tickets for \`${payment.toLocaleString()}\` coins. You now have \`${bot.lottoEntries.filter(v => v === interaction.user.id).length.toLocaleString()}\` entries`)
          ],
          components: []
        })

      } else if (i.customId === 'cancel') {
        canceled = true
        collector.stop()
        confirmMessage.edit({
          embeds: [
            new EmbedBuilder()
            .setTitle('Canceled')
            .setColor(colours.blend)
          ],
          components: []
        })
      }
    })
    collector.on('end', async() => {
      if (canceled === true) return
      confirmMessage.edit({
        embeds: [
          new EmbedBuilder()
          .setTitle('Timed out')
          .setColor(colours.blend)
        ],
        components: []
      })
    })

  }
}