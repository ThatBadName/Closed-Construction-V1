const profileSchema = require('../../models/userProfile')
const functions = require('../../commandFunctions')
const allJobs = require('../../things/jobs/allJobs')
const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder
} = require('discord.js')
const inventorySchema = require('../../models/inventorySchema')
const {
    colours,
    emojis
} = require('../../things/constants')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work for some extra cash')
        .setDMPermission(false)
        .addSubcommand(option =>
            option.setName('list')
            .setDescription('List available jobs')
        )

        .addSubcommand(option =>
            option.setName('shift')
            .setDescription('Work a shift for some cash')
        )

        .addSubcommand(option =>
            option.setName('apply')
            .setDescription('Get a new job')
            .addStringOption(option =>
                option.setName('job')
                .setDescription('The new job to work as')
                .setMaxLength(17)
                .setAutocomplete(true)
                .setRequired(true)
            )
        )

        .addSubcommand(option =>
            option.setName('resign')
            .setDescription('Resign from your job')
        ),

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true)

        if (focusedOption.name === 'job') {
            const focusedValue = interaction.options.getFocused()
            const choices = allJobs.map(j => j.name)
            const filtered = choices.filter((choice) =>
                choice.startsWith(focusedValue)
            ).slice(0, 25)
            await interaction.respond(
                filtered.map((choice) => ({
                    name: choice,
                    value: choice
                }))
            )
        }
    },

    async execute(interaction) {
        const blks = await functions.blacklistCheck(interaction.user.id, interaction.guild.id, interaction)
        if (blks === true) return
        const main = await functions.checkMaintinance(interaction)
        if (main === true) return

        await interaction.deferReply()

        if (interaction.options.getSubcommand() === 'list') {
            const cldn = await functions.cooldownCheck(interaction.user.id, 'job-list', 5, interaction)
            if (cldn === true) return

            let result = await profileSchema.findOne({
                userId: interaction.user.id
            })
            if (!result) result = await profileSchema.create({
                userId: interaction.user.id
            })
            functions.createRecentCommand(interaction.user.id, 'job-list', `None`, interaction)

            const jobList = allJobs
            const embeds = await workPages(jobList, result)

            let firstEmbed
            let currentPage = 0
            const pageButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('firstPage')
                .setEmoji('<:FirstPage:1011987981713817620>')
                .setDisabled(true)
                .setStyle('Primary'),

                new ButtonBuilder()
                .setCustomId('backPage')
                .setEmoji('<:PreviousPage:1011987986033938462>')
                .setDisabled(true)
                .setStyle('Primary'),

                new ButtonBuilder()
                .setCustomId('nextPage')
                .setEmoji('<:NextPage:1011987984385593415>')
                .setStyle('Primary'),

                new ButtonBuilder()
                .setCustomId('lastPage')
                .setEmoji('<:LastPage:1011987983060193290>')
                .setStyle('Primary'),
            )

            if (embeds.length === 1) {
                firstEmbed = await interaction.editReply({
                    embeds: [embeds[0].setFooter({
                        text: `Page ${currentPage + 1}/${embeds.length}`
                    })],
                    components: [],
                    fetchReply: true
                }).catch(() => {
                    return interaction.editReply({
                        embeds: [new EmbedBuilder().setColor(colours.blend).setTitle(`I could not find any jobs`)],
                        fetchReply: true
                    })
                })
            } else if (embeds.length === 0) {
                return interaction.editReply({
                    embeds: [new EmbedBuilder().setColor(colours.blend).setTitle(`I could not find any jobs`)],
                    fetchReply: true
                })
            } else {
                firstEmbed = await interaction.editReply({
                    embeds: [embeds[0].setFooter({
                        text: `Page ${currentPage + 1}/${embeds.length}`
                    })],
                    components: [pageButtons],
                    fetchReply: true
                }).catch(() => {
                    return interaction.editReply({
                        embeds: [new EmbedBuilder().setColor(colours.blend).setTitle(`I could not find any jobs`)],
                        fetchReply: true
                    })
                })
            }

            const pageButtonCollector = await firstEmbed.createMessageComponentCollector({
                type: 'Button',
                time: 30000
            })

            pageButtonCollector.on('collect', async (i) => {
                if (i.user.id !== interaction.user.id)
                    return i.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle('This is not for you')
                            .setColor('0xa477fc')
                        ],
                        ephemeral: true,
                    })
                if (i.customId === 'backPage') {
                    if (currentPage !== 0) {
                        --currentPage
                        if (currentPage === 0) {
                            pageButtons.components[2].setDisabled(false)
                            pageButtons.components[3].setDisabled(false)
                            pageButtons.components[0].setDisabled(true)
                            pageButtons.components[1].setDisabled(true)
                        } else {
                            pageButtons.components[2].setDisabled(false)
                            pageButtons.components[3].setDisabled(false)
                            pageButtons.components[0].setDisabled(false)
                            pageButtons.components[1].setDisabled(false)
                        }
                        firstEmbed.edit({

                            embeds: [embeds[currentPage].setFooter({
                                text: `Page ${currentPage + 1}/${embeds.length}`
                            })],
                            components: [pageButtons]
                        })
                        i.deferUpdate()
                        pageButtonCollector.resetTimer()
                    } else i.reply({
                        content: `There are no more pages`,
                        ephemeral: true,
                    })
                } else if (i.customId === 'nextPage') {
                    if (currentPage + 1 !== embeds.length) {
                        currentPage++
                        if (currentPage + 1 === embeds.length) {
                            pageButtons.components[0].setDisabled(false)
                            pageButtons.components[1].setDisabled(false)
                            pageButtons.components[2].setDisabled(true)
                            pageButtons.components[3].setDisabled(true)
                        } else {
                            pageButtons.components[2].setDisabled(false)
                            pageButtons.components[3].setDisabled(false)
                            pageButtons.components[0].setDisabled(false)
                            pageButtons.components[1].setDisabled(false)
                        }
                        firstEmbed.edit({

                            embeds: [embeds[currentPage].setFooter({
                                text: `Page ${currentPage + 1}/${embeds.length}`
                            })],
                            components: [pageButtons]
                        })
                        i.deferUpdate()
                        pageButtonCollector.resetTimer()
                    } else i.reply({
                        content: `There are no more pages`,
                        ephemeral: true,
                    })
                } else if (i.customId === 'lastPage') {
                    if (currentPage + 1 !== embeds.length) {
                        currentPage = embeds.length - 1
                        if (currentPage + 1 === embeds.length) {
                            pageButtons.components[0].setDisabled(false)
                            pageButtons.components[1].setDisabled(false)
                            pageButtons.components[2].setDisabled(true)
                            pageButtons.components[3].setDisabled(true)
                        } else {
                            pageButtons.components[2].setDisabled(false)
                            pageButtons.components[3].setDisabled(false)
                            pageButtons.components[0].setDisabled(false)
                            pageButtons.components[1].setDisabled(false)
                        }
                        firstEmbed.edit({

                            embeds: [embeds[currentPage].setFooter({
                                text: `Page ${currentPage + 1}/${embeds.length}`
                            })],
                            components: [pageButtons]
                        })
                        i.deferUpdate()
                        pageButtonCollector.resetTimer()
                    } else i.reply({
                        content: `There are no more pages`,
                        ephemeral: true,
                    })
                } else if (i.customId === 'firstPage') { //!
                    if (currentPage !== 0) {
                        currentPage = 0
                        if (currentPage === 0) {
                            pageButtons.components[2].setDisabled(false)
                            pageButtons.components[3].setDisabled(false)
                            pageButtons.components[0].setDisabled(true)
                            pageButtons.components[1].setDisabled(true)
                        } else {
                            pageButtons.components[2].setDisabled(false)
                            pageButtons.components[3].setDisabled(false)
                            pageButtons.components[0].setDisabled(false)
                            pageButtons.components[1].setDisabled(false)
                        }
                        firstEmbed.edit({

                            embeds: [embeds[currentPage].setFooter({
                                text: `Page ${currentPage + 1}/${embeds.length}`
                            })],
                            components: [pageButtons]
                        })
                        i.deferUpdate()
                        pageButtonCollector.resetTimer()
                    } else i.reply({
                        content: `There are no more pages`,
                        ephemeral: true,
                    })
                }
            })
            pageButtonCollector.on('end', i => {
                firstEmbed.edit({
                    components: []
                })
            })

            async function workPages(arr, profile) {
                const embeds = []
                let k = 4
                for (let i = 0; i < arr.length; i += 4) {
                    const current = arr.slice(i, k)
                    let j = i
                    k += 4
                    let info = ``
                    info = current.map(item => (item.levelRequired <= profile.shifts ? '> ' : `> ${emojis.fail} `) + `**${item.name}**\n> \`${item.pay.toLocaleString(0)}\` per hour - Requires \`${item.levelRequired}\` shifts`).join('\n\n')
                    const embed = new EmbedBuilder()
                        .setColor('0x' + colours.blend)
                        .setTitle(`Available Jobs`)
                        .setDescription(`Jobs with a ${emojis.fail} are locked\n\n` + info)
                    embeds.push(embed)
                }
                return embeds
            }
        } else if (interaction.options.getSubcommand() === 'apply') {

            let jobQuery = interaction.options.getString('job')
            jobQuery = jobQuery

            functions.createRecentCommand(interaction.user.id, 'job-new', `JOB: ${jobQuery}`, interaction)

            const search = !!allJobs.find((value) => value.name === jobQuery)
            if (!search) return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle('That job does not exist')
                    .setColor('0x' + colours.error)
                ]
            })
            const jobFound = allJobs.find((value) => value.name === jobQuery)
            let userProfile = await profileSchema.findOne({
                userId: interaction.user.id
            })
            if (!userProfile) {
                userProfile = await profileSchema.create({
                    userId: interaction.user.id
                })
            }
            if (userProfile.shifts < jobFound.levelRequired) return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setColor('0x' + colours.alert)
                    .setTitle(`You must work a few more shifts for this job`)
                ]
            })

            if (userProfile.job === jobFound.name) return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle('You already work as this')
                    .setColor('0x' + colours.alert)
                ]
            })
            const cldn = await functions.cooldownCheck(interaction.user.id, 'job-new', 21600, interaction)
            if (cldn === true) return
            await profileSchema.findOneAndUpdate({
                userId: interaction.user.id
            }, {
                job: jobFound.name,
                $unset: {
                    getsFiresOn: ""
                }
            })
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle('You got a new job!')
                    .setDescription(`You now work as a ${jobFound.name}`)
                    .setColor('0x' + colours.blend)
                ]
            })

        } else if (interaction.options.getSubcommand() === 'resign') {
            functions.createRecentCommand(interaction.user.id, 'job-resign', `None`, interaction)
            const userProfile = await profileSchema.findOne({
                userId: interaction.user.id
            })
            if (!userProfile) {
                profileSchema.create({
                    userId: interaction.user.id
                })
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`You do not have a job`)
                        .setDescription('Get a job with </work apply:1028347270632058910>')
                        .setColor('0x' + colours.blend)
                    ]
                })
            }
            if (userProfile.job === '') return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`You do not have a job`)
                    .setColor('0x' + colours.blend)
                ]
            })
            userProfile.job = ''
            userProfile.save()
            const cldn = await functions.cooldownCheck(interaction.user.id, 'job-new', 21600, interaction)
            if (cldn === true) return

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle('You have resigned from your job')
                    .setDescription('You must wait 6 hours before getting a new job')
                    .setColor('0x' + colours.blend)
                ]
            })
        } else if (interaction.options.getSubcommand() === 'shift') {
            const profile = await profileSchema.findOne({
                userId: interaction.user.id
            })
            if (!profile) {
                profileSchema.create({
                    userId: interaction.user.id
                })
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`You do not have a job`)
                        .setDescription('Get a job with </work apply:1028347270632058910>')
                        .setColor('0x' + colours.blend)
                    ]
                })
            }
            if (profile.job === '') return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`You do not have a job`)
                    .setDescription('Get a job with </work apply:1028347270632058910>')
                    .setColor('0x' + colours.blend)
                ]
            })
            let jobQuery = profile.job
            jobQuery = jobQuery

            const search = !!allJobs.find((value) => value.name === jobQuery)
            if (!search) return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle('That job does not exist')
                    .setColor('0x' + colours.blend)
                ]
            })
            const jobFound = allJobs.find((value) => value.name === jobQuery)
            if (profile.hasBeenFired === true) {
                await profileSchema.findOneAndUpdate({
                    userId: interaction.user.id
                }, {
                    job: '',
                    hasBeenFired: false,
                    $unset: {
                        getsFiresOn: ""
                    }
                })

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle('You have been fired')
                        .setColor('0x' + colours.blend)
                        .setDescription(`You have not worked for 3 days and so your boss fired you`)
                    ]
                })

                return await functions.cooldownCheck(interaction.user.id, 'job-new', 21600, interaction)
            }
            const cldn = await functions.cooldownCheck(interaction.user.id, 'job-work', 3600, interaction)
            if (cldn === true) return


            const date = new Date()
            date.setHours(date.getHours() + 72)

            let pay = jobFound.pay
            if (profile.shifts > 100) {
                pay *= Math.round(jobFound.shifts / 100)
            }

            if (profile.job === 'Cook') {
                const rng = Math.round(Math.random() * (10 - 1) + 1)
                if (rng === 1) {
                    const lookupInv = await inventorySchema.findOne({
                        userId: interaction.user.id,
                        itemId: 'cheese'
                    })
                    if (!lookupInv) inventorySchema.create({
                        userId: interaction.user.id,
                        itemId: 'cheese',
                        item: 'Cheese',
                        amount: 1,
                        emoji: emojis.cheese
                    })
                    else {
                        lookupInv.amount += 1;
                        lookupInv.save()
                    }

                    profile.wallet += jobFound.pay
                    profile.getsFiresOn = date,
                        profile.shifts += 1,
                        profile.save()

                    return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle('You worked as a Cook')
                            .setDescription(`You got \`${jobFound.pay.toLocaleString()}\` coins and 1 ${emojis.cheese}Cheese`)
                            .setColor('0x' + colours.blend)
                        ]
                    })
                } else if (profile.job === 'Developer') {
                    const rng = Math.round(Math.random() * (100 - 1) + 1)
                    if (rng === 1) {
                        const lookupInv = await inventorySchema.findOne({
                            userId: interaction.user.id,
                            itemId: 'developer box'
                        })
                        if (!lookupInv) inventorySchema.create({
                            userId: interaction.user.id,
                            itemId: 'developer box',
                            item: 'Developer Box',
                            amount: 1,
                            emoji: emojis.devBox
                        })
                        else {
                            lookupInv.amount += 1;
                            lookupInv.save()
                        }

                        profile.wallet += jobFound.pay
                        profile.getsFiresOn = date
                        profile.shifts += 1,
                            profile.save()

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle('You worked as a Developer')
                                .setDescription(`You got \`${jobFound.pay.toLocaleString()}\` coins and 1 ${emojis.devBox}Developer Box`)
                                .setColor('0x' + colours.blend)
                            ]
                        })
                    } else {
                        profile.wallet += jobFound.pay
                        profile.getsFiresOn = date
                        profile.save()

                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle('You worked as a Developer')
                                .setDescription(`You got \`${jobFound.pay.toLocaleString()}\` coins`)
                                .setColor('0x' + colours.blend)
                            ]
                        })
                    }
                }
            }

            profile.wallet += jobFound.pay
            profile.getsFiresOn = date
            profile.shifts += 1,
                profile.save()

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`You worked as a ${profile.job}`)
                    .setDescription(`You got \`${jobFound.pay.toLocaleString()}\` coins`)
                    .setColor('0x' + colours.blend)
                ]
            })
        }
    }
}