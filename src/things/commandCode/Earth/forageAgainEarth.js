const invSchema = require('../../../models/inventorySchema')
const functions = require('../../../commandFunctions')
const profileSchema = require('../../../models/userProfile')
const { colours, emojis, reasonsToBreakAxe, randomItemsForage } = require('../../../things/constants')
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js')

async function forageAgainEarth(interaction) {
    let userProfile = await profileSchema.findOne({
        userId: interaction.user.id
    })
    if (!userProfile) userProfile = await profileSchema.create({userId: interaction.user.id})

    const checkForAxe = await invSchema.findOne({
        userId: interaction.user.id,
        itemId: 'axe'
    })
    if (!checkForAxe) return interaction.followUp({
        embeds: [
            new EmbedBuilder()
            .setTitle('You need an axe to use this')
            .setColor('0x' + colours.alert)
            .setDescription('You can buy an axe from the shop using </shop buy:1006572910552551484>')
        ],
        components: [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('Forage Again')
                .setCustomId('forage-again')
                .setStyle('Secondary'),

                new ButtonBuilder()
                .setLabel('Buy Axe')
                .setCustomId('buy-axe')
                .setStyle('Secondary')
            )
        ]
    })

    const reward = functions.generateLootTable('forageEarth')[0]
    let amount = Math.round(Math.random() * (reward.maxAmount - reward.minAmount) + reward.minAmount)
    if (reward.id === 'COINS') {
        amount = Math.round((amount / 100 * userProfile.coinMulti) + amount)
        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.user.tag} went foraging`)
                .setColor('0x' + colours.blend)
                .setDescription(`You went foraging and found \`${amount.toLocaleString()}\` coins`)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Forage Again')
                    .setCustomId('forage-again')
                    .setStyle('Secondary')
                )
            ]
        })

        userProfile.wallet += amount
        userProfile.save()
    } else if (reward.id === 'BREAK') {
        if (checkForAxe.amount === 1) checkForAxe.delete()
        else {checkForAxe.amount -= 1; checkForAxe.save()}

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.user.tag} Uhhh something happened`)
                .setColor('0x' + colours.blend)
                .setDescription(`${reasonsToBreakAxe[Math.floor(Math.random() * reasonsToBreakAxe.length)]}\n`)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Forage Again')
                    .setCustomId('forage-again')
                    .setStyle('Secondary')
                )
            ]
        })
    } else {
        const inventory = await invSchema.findOne({userId: interaction.user.id, itemId: reward.id})
        if (!inventory) await invSchema.create({userId: interaction.user.id, itemId: reward.id, item: reward.name, emoji: reward.emoji, amount: amount})
        else { inventory.amount += amount, inventory.save() }

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.user.tag} went foraging`)
                .setColor('0x' + colours.blend)
                .setDescription(`Wow, rather than the usual coins you foraged ${amount}x ${reward.emoji}${reward.name}`)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Forage Again')
                    .setCustomId('forage-again')
                    .setStyle('Secondary')
                )
            ]
        })
    }
}

module.exports = {
    forageAgainEarth
}