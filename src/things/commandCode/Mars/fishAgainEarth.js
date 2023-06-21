const invSchema = require('../../../models/inventorySchema')
const functions = require('../../../commandFunctions')
const profileSchema = require('../../../models/userProfile')
const { colours, emojis, reasonsToBreakRod } = require('../../../things/constants')
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js')

async function fishAgainEarth(interaction) {
    let userProfile = await profileSchema.findOne({
        userId: interaction.user.id
    })
    if (!userProfile) userProfile = await profileSchema.create({userId: interaction.user.id})

    const checkForRod = await invSchema.findOne({
        userId: interaction.user.id,
        itemId: 'rod'
    })
    if (!checkForRod) return interaction.followUp({
        embeds: [
            new EmbedBuilder()
            .setTitle('You need a fishing rod to use this')
            .setColor('0x' + colours.alert)
            .setDescription('You can buy a rod from the shop using </shop buy:1006572910552551484>')
        ],
        components: [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('Fish Again')
                .setCustomId('fish-again')
                .setStyle('Secondary'),
    
                new ButtonBuilder()
                .setLabel('Buy Rod')
                .setCustomId('buy-rod')
                .setStyle('Secondary')
            )
        ]
    })

    const reward = functions.generateLootTable('fishMars')[0]
    let amount = Math.round(Math.random() * (reward.maxAmount - reward.minAmount) + reward.minAmount)
    if (reward.id === 'COINS') {
        amount = Math.round((amount / 100 * userProfile.coinMulti) + amount)
        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.user.tag} went fishing`)
                .setColor('0x' + colours.blend)
                .setDescription(`You went fishing and found \`${amount.toLocaleString()}\` coins`)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Fish Again')
                    .setCustomId('fish-again')
                    .setStyle('Secondary')
                )
            ]
        })

        userProfile.wallet += amount
        userProfile.save()
    } else if (reward.id === 'BREAK') {
        if (checkForRod.amount === 1) checkForRod.delete()
        else {checkForRod.amount -= 1; checkForRod.save()}

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.user.tag} Uhhh something happened`)
                .setColor('0x' + colours.blend)
                .setDescription(`${reasonsToBreakRod[Math.floor(Math.random() * reasonsToBreakRod.length)]}\n`)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Fish Again')
                    .setCustomId('fish-again')
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
                .setTitle(`${interaction.user.tag} went fishing`)
                .setColor('0x' + colours.blend)
                .setDescription(`Wow, rather than the usual coins you caught ${amount}x ${reward.emoji}${reward.name}`)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Fish Again')
                    .setCustomId('fish-again')
                    .setStyle('Secondary')
                )
            ]
        })
    }
}

module.exports = {
    fishAgainEarth
}