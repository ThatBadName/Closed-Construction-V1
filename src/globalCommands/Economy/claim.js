const profileSchema = require('../../models/userProfile')
const {
    EmbedBuilder,
    SlashCommandBuilder
} = require('discord.js')
const {
    colours
} = require('../../things/constants')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('claim')
        .setDMPermission(false)
        .setDescription('Claim some coins')
        .addSubcommand(option =>
            option.setName('daily')
            .setDescription('Claim your daily coins')
        )

        .addSubcommand(option =>
            option.setName('weekly')
            .setDescription('Claim your weekly coins')
        )

        .addSubcommand(option =>
            option.setName('monthly')
            .setDescription('Claim your monthly coins')
        ),

    async execute(
        interaction
    ) {
        const functions = require('../../commandFunctions')
        const blks = await functions.blacklistCheck(interaction.user.id, interaction.guild.id, interaction)
        if (blks === true) return
        const main = await functions.checkMaintinance(interaction)
        if (main === true) return

        await interaction.deferReply()

        if (interaction.options.getSubcommand() === 'daily') {
            const cldn = await functions.cooldownCheck(interaction.user.id, 'daily', 86400, interaction)
            if (cldn === true) return
            functions.createRecentCommand(interaction.user.id, 'claim-daily', `None`, interaction)

            var dateDaily = new Date()
            dateDaily.setHours(48, 0, 0)
            var nowUTC = Date.UTC(dateDaily.getUTCFullYear(), dateDaily.getUTCMonth(), dateDaily.getUTCDate(), dateDaily.getUTCHours() - 4, dateDaily.getUTCMinutes(), dateDaily.getUTCSeconds())

            const userProfile = await profileSchema.findOne({
                userId: interaction.user.id
            })
            if (!userProfile) {
                profileSchema.create({
                    userId: interaction.user.id,
                    wallet: 10000,
                    dailyStreak: 1,
                    dailyExpires: nowUTC

                })
            } else {
                var date = new Date()
                date.setHours(48, 0, 0)

                var dateDaily = new Date()
                dateDaily.setHours(24, 0, 0)
                var nowUTC = Date.UTC(dateDaily.getUTCFullYear(), dateDaily.getUTCMonth(), dateDaily.getUTCDate(), dateDaily.getUTCHours() - 4, dateDaily.getUTCMinutes(), dateDaily.getUTCSeconds())
                if (!userProfile.dailyExpires || checkDate(userProfile.dailyExpires)) {
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle('You have claimed your daily coins!')
                            .setDescription(`You have been given \`10,000\` coins`)
                            .setFields({
                                name: 'Base',
                                value: '10,000',
                                inline: true
                            }, {
                                name: 'Streak Bonus',
                                value: `0`,
                                inline: true
                            }, {
                                name: 'Streak',
                                value: '1',
                                inline: true
                            }, {
                                name: 'Next Daily',
                                value: `<t:${Math.round(nowUTC / 1000)}:R>`,
                            })
                            .setFooter({
                                text: userProfile.dailyExpires ? `Aww what a shame, you lost your daily streak of ${userProfile.dailyStreak.toLocaleString()}` : 'Day 1 of your streak!'
                            })
                            .setColor(16777215)
                        ]
                    })

                    userProfile.wallet += 10000,
                        userProfile.dailyStreak = 1,
                        userProfile.dailyExpires = nowUTC
                    userProfile.save()

                } else {
                    var dateDaily = new Date()
                    dateDaily.setHours(24, 0, 0)
                    var nowUTC = Date.UTC(dateDaily.getUTCFullYear(), dateDaily.getUTCMonth(), dateDaily.getUTCDate(), dateDaily.getUTCHours() - 4, dateDaily.getUTCMinutes(), dateDaily.getUTCSeconds())

                    userProfile.wallet += (10000 + ((userProfile.dailyStreak) - 1 * 10000)),
                        userProfile.dailyStreak += 1,
                        userProfile.dailyExpires = nowUTC
                    userProfile.save()

                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle('You have claimed your daily coins!')
                            .setDescription(`You have been given \`${(10000 + ((userProfile.dailyStreak - 1) * 10000)).toLocaleString()}\` coins`)
                            .setFields({
                                name: 'Base',
                                value: '10,000',
                                inline: true
                            }, {
                                name: 'Streak Bonus',
                                value: `${((userProfile.dailyStreak - 1) * 10000).toLocaleString()}`,
                                inline: true
                            }, {
                                name: 'Streak',
                                value: `${userProfile.dailyStreak.toLocaleString()}`,
                                inline: true
                            }, {
                                name: 'Next Daily',
                                value: `<t:${Math.round(nowUTC / 1000)}:R>`,
                            })
                            .setFooter({
                                text: `Going strong!`
                            })
                            .setColor(16777215)
                        ]
                    })
                }

                function checkDate(result) {
                    const current = new Date();

                    return result < current;
                }
            }
        } else if (interaction.options.getSubcommand() === 'weekly') {
            const cldn = await functions.cooldownCheck(interaction.user.id, 'weekly', 604800, interaction)
            if (cldn === true) return
            functions.createRecentCommand(interaction.user.id, 'claim-weekly', `None`, interaction)

            const userProfile = await profileSchema.findOne({
                userId: interaction.user.id
            })
            if (!userProfile) {
                profileSchema.create({
                    userId: interaction.user.id,
                    wallet: 25000
                })
            } else {
                userProfile.wallet += 25000
                userProfile.save()
            }
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle('You have claimed your weekly coins!')
                    .setDescription(`You have been given \`25,000\` coins`)
                    .setColor(16777215)
                ]
            })
        } else if (interaction.options.getSubcommand() === 'monthly') {
            const cldn = await functions.cooldownCheck(interaction.user.id, 'monthly', 2628288, interaction)
            if (cldn === true) return
            functions.createRecentCommand(interaction.user.id, 'claim-monthly', `None`, interaction)

            const userProfile = await profileSchema.findOne({
                userId: interaction.user.id
            })
            if (!userProfile) {
                profileSchema.create({
                    userId: interaction.user.id,
                    wallet: 1000000
                })
            } else {
                userProfile.wallet += 1000000
                userProfile.save()
            }
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle('You have claimed your monthly coins!')
                    .setDescription(`You have been given \`1,000,000\` coins`)
                    .setColor(16777215)
                ]
            })
        }
    }
}