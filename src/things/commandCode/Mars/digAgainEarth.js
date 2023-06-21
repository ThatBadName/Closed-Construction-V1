const invSchema = require('../../../models/inventorySchema')
const functions = require('../../../commandFunctions')
const profileSchema = require('../../../models/userProfile')
const { colours, emojis, reasonsToBreakShovelShovelShovel, randomItemsDig } = require('../../../things/constants')
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js')

async function digAgainOnEarth(interaction) {
    let userProfile = await profileSchema.findOne({
        userId: interaction.user.id
    })
    if (!userProfile) userProfile = await profileSchema.create({userId: interaction.user.id})

    const checkForShovel = await invSchema.findOne({
        userId: interaction.user.id,
        itemId: 'shovel'
    })
    if (!checkForShovel) return interaction.followUp({
        embeds: [
            new EmbedBuilder()
            .setTitle('You need a shovel to use this')
            .setColor('0x' + colours.alert)
            .setDescription('You can buy a shovel from the shop using </shop buy:1006572910552551484>')
        ],
        components: [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('Dig Again')
                .setCustomId('dig-again')
                .setStyle('Secondary'),

                new ButtonBuilder()
                .setLabel('Buy Shovel')
                .setCustomId('buy-shovel')
                .setStyle('Secondary')
            )
        ]
    })

    const reward = functions.generateLootTable('digMars')[0]
    let amount = Math.round(Math.random() * (reward.maxAmount - reward.minAmount) + reward.minAmount)
    if (reward.id === 'COINS') {
        amount = Math.round((amount / 100 * userProfile.coinMulti) + amount)
        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.user.tag} went digging`)
                .setColor('0x' + colours.blend)
                .setDescription(`You went digging and found \`${amount.toLocaleString()}\` coins`)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Dig Again')
                    .setCustomId('dig-again')
                    .setStyle('Secondary')
                )
            ]
        })

        userProfile.wallet += amount
        userProfile.save()
    } else if (reward.id === 'BREAK') {
        if (checkForShovel.amount === 1) checkForShovel.delete()
        else {checkForShovel.amount -= 1; checkForShovel.save()}

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.user.tag} Uhhh something happened`)
                .setColor('0x' + colours.blend)
                .setDescription(`${reasonsToBreakShovel[Math.floor(Math.random() * reasonsToBreakShovel.length)]}\n`)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Dig Again')
                    .setCustomId('dig-again')
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
                .setTitle(`${interaction.user.tag} went digging`)
                .setColor('0x' + colours.blend)
                .setDescription(`Wow, rather than the usual coins you found ${amount}x ${reward.emoji}${reward.name}`)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Dig Again')
                    .setCustomId('dig-again')
                    .setStyle('Secondary')
                )
            ]
        })
    }
}

module.exports = {
    digAgainOnEarth
}