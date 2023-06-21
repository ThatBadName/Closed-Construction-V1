const invSchema = require('../../../models/inventorySchema')
const functions = require('../../../commandFunctions')
const profileSchema = require('../../../models/userProfile')
const { colours, emojis, reasonsToBreakGun, randomItemsHunt } = require('../../../things/constants')
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js')

async function huntOnEarth(interaction) {
    let userProfile = await profileSchema.findOne({
        userId: interaction.user.id
    })
    if (!userProfile) userProfile = await profileSchema.create({userId: interaction.user.id})

    const checkForPick = await invSchema.findOne({
        userId: interaction.user.id,
        itemId: 'rifle'
    })
    const checkForAmmo = await invSchema.findOne({
        userId: interaction.user.id,
        itemId: 'ammo'
    })
    if (!checkForPick) return interaction.editReply({
        embeds: [
            new EmbedBuilder()
            .setTitle('You need a rifle to use this')
            .setColor('0x' + colours.alert)
            .setDescription('You can buy a rifle from the shop using </shop buy:1006572910552551484>')
        ],
        components: [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('Hunt Again')
                .setCustomId('hunt-again')
                .setStyle('Secondary'),

                new ButtonBuilder()
                .setLabel('Buy Rifle')
                .setCustomId('buy-rifle')
                .setStyle('Secondary')
            )
        ]
    })
    if (!checkForAmmo) return interaction.editReply({
        embeds: [
            new EmbedBuilder()
            .setTitle('You do not have any ammo')
            .setColor('0x' + colours.alert)
            .setDescription('You can buy ammo from the shop (\`/shop buy item:ammo\`)')
        ],
        components: [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('Hunt Again')
                .setCustomId('hunt-again')
                .setStyle('Secondary'),

                new ButtonBuilder()
                .setLabel('Buy Ammo')
                .setCustomId('buy-ammo')
                .setStyle('Secondary')
            )
        ]
    })

    const reward = functions.generateLootTable('huntEarth')[0]
    let amount = Math.round(Math.random() * (reward.maxAmount - reward.minAmount) + reward.minAmount)
    if (reward.id === 'COINS') {
        amount = Math.round((amount / 100 * userProfile.coinMulti) + amount)
        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.user.tag} went hunting`)
                .setColor('0x' + colours.blend)
                .setDescription(`You went hunting and found \`${amount.toLocaleString()}\` coins`)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Hunt Again')
                    .setCustomId('hunt-again')
                    .setStyle('Secondary')
                )
            ]
        })

        userProfile.wallet += amount
        userProfile.save()
    } else if (reward.id === 'BREAK') {
        if (checkForPick.amount === 1) checkForPick.delete()
        else {checkForPick.amount -= 1; checkForPick.save()}

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.user.tag} Uhhh something happened`)
                .setColor('0x' + colours.blend)
                .setDescription(`${reasonsToBreakGun[Math.floor(Math.random() * reasonsToBreakGun.length)]}\n`)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Hunt Again')
                    .setCustomId('hunt-again')
                    .setStyle('Secondary')
                )
            ]
        })
    } else {
        const inventory = await invSchema.findOne({userId: interaction.user.id, itemId: reward.id})
        if (!inventory) await invSchema.create({userId: interaction.user.id, itemId: reward.id, item: reward.name, emoji: reward.emoji, amount: amount})
        else { inventory.amount += amount, inventory.save() }

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.user.tag} went hunting`)
                .setColor('0x' + colours.blend)
                .setDescription(`Wow, rather than the usual coins you found ${amount}x ${reward.emoji}${reward.name}`)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setLabel('Hunt Again')
                    .setCustomId('hunt-again')
                    .setStyle('Secondary')
                )
            ]
        })
    }
}

module.exports = {
    huntOnEarth
}