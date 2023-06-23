const invSchema = require('../../../models/inventorySchema')
const functions = require('../../../commandFunctions')
const profileSchema = require('../../../models/userProfile')
const { colours, emojis, randomItemsMineMars, reasonsToBreakPick } = require('../../../things/constants')
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js')

async function mineAgainEarth(interaction) {
    let userProfile = await profileSchema.findOne({
        userId: interaction.user.id
    })
    if (!userProfile) userProfile = await profileSchema.create({userId: interaction.user.id})

    const checkForPick = await invSchema.findOne({
        userId: interaction.user.id,
        itemId: 'pickaxe'
    })
    if (!checkForPick) return interaction.followUp({
        embeds: [
            new EmbedBuilder()
            .setTitle('You need a pickaxe to use this')
            .setColor(16777215)
            .setDescription('You can buy a pick from the shop using </shop buy:1006572910552551484>')
        ],
        components: [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('Mine Again')
                .setCustomId('mine-again')
                .setStyle('Secondary'),

                new ButtonBuilder()
                .setLabel('Buy Pickaxe')
                .setCustomId('buy-pickaxe')
                .setStyle('Secondary')
            )
        ]
    })

    const reward = functions.generateLootTable('mineEarth')[0]
    let amount = Math.round(Math.random() * (reward.maxAmount - reward.minAmount) + reward.minAmount)
    if (reward.id === 'COINS') {
        amount = Math.round((amount / 100 * userProfile.coinMulti) + amount)
        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.user.tag} went mining`)
                .setColor(16777215)
                .setDescription(`You went mining and dug up \`${amount.toLocaleString()}\` coins`)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Mine Again')
                    .setCustomId('mine-again')
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
                .setColor(16777215)
                .setDescription(`${reasonsToBreakPick[Math.floor(Math.random() * reasonsToBreakPick.length)]}\n`)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Mine Again')
                    .setCustomId('mine-again')
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
                .setTitle(`${interaction.user.tag} went mining`)
                .setColor(16777215)
                .setDescription(`Wow, rather than the usual coins you mined ${amount}x ${reward.emoji}${reward.name}`)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Mine Again')
                    .setCustomId('mine-again')
                    .setStyle('Secondary')
                )
            ]
        })
    }
}

module.exports = {
    mineAgainEarth
}