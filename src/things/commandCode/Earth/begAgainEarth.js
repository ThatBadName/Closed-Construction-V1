const invSchema = require('../../../models/inventorySchema')
const profileSchema = require('../../../models/userProfile')
const { colours, emojis, begLocations } = require('../../../things/constants')
const functions = require('../../../commandFunctions')
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js')

async function begAgainEarth(interaction) {
    let userProfile = await profileSchema.findOne({
        userId: interaction.user.id
    })
    if (!userProfile) userProfile = await profileSchema.create({userId: interaction.user.id})
    const reward = functions.generateLootTable('begEarth')[0]
    let amount = Math.round(Math.random() * (reward.maxAmount - reward.minAmount) + reward.minAmount)
    if (reward.id === 'COINS') {
        amount = Math.round((amount / 100 * userProfile.coinMulti) + amount)
        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.user.tag} went begging`)
                .setColor('0x' + colours.blend)
                .setDescription(`${(begLocations[Math.floor(Math.random() * begLocations.length)]).replaceAll('{amount}', `${amount.toLocaleString()}`)}`)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Beg Again')
                    .setCustomId('beg-again')
                    .setStyle('Secondary')
                )
            ]
        })

        userProfile.wallet += amount
        userProfile.save()
    } else {
        const inventory = await invSchema.findOne({userId: interaction.user.id, itemId: reward.id})
        if (!inventory) await invSchema.create({userId: interaction.user.id, itemId: reward.id, item: reward.name, emoji: reward.emoji, amount: amount})
        else { inventory.amount += amount, inventory.save() }

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.user.tag} went begging`)
                .setColor('0x' + colours.blend)
                .setDescription(`Wow, rather than the usual coins you got given ${amount}x ${reward.emoji}${reward.name}`)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Beg Again')
                    .setCustomId('beg-again')
                    .setStyle('Secondary')
                )
            ]
        })
    }
}

module.exports = {
    begAgainEarth
}