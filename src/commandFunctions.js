const blacklistedUsers = require('./models/blacklistUser')
const blacklistedGuilds = require('./models/blacklistGuild')
const commandCooldowns = require('./models/cooldowns')
const profileSchema = require('./models/userProfile')
const recentCommandSchema = require('./models/recentCommands')
const robCooldowns = require('./models/robCooldowns')
const notificationSchema = require('./models/notifications')
const maintenance = require('./models/mantenance')
const premiumUsers = require('./models/premiumUsers')
const premiumGuilds = require('./models/premiumGuilds')
const voucher_codes = require('voucher-code-generator')
const premiumCodeSchema = require('./models/premiumCodes')
const activeDevCoinSchema = require('./models/activeDevCoins')
const verification = require('./models/verification')
const failedVerification = require('./models/verificationFailed')
const botSchema = require('./models/bot')
const Discord = require('discord.js')
const cooldowns = new Discord.Collection()
const {
    EmbedBuilder,
    WebhookClient,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js')
const {
    colours
} = require('./things/constants')

async function blacklistCheck(idUser, idGuild, interaction) {
    const blacklistCheckUser = await blacklistedUsers.findOne({
        userId: idUser
    })
    const blacklistCheckGuild = await blacklistedGuilds.findOne({
        guildId: idGuild
    })
    if (blacklistCheckUser) return interaction.reply({
        ephemeral: true,
        embeds: [new EmbedBuilder().setColor('0x' + colours.alert).setTitle('You are blacklisted from using the bot.').setDescription('Appeal in the [support server](https://discord.gg/hK3gEQ2XUf)').setFields({
            name: 'Date Added',
            value: `<t:${Math.round(blacklistCheckUser.createdAt.getTime() / 1000)}> (<t:${Math.round(blacklistCheckUser.createdAt.getTime() / 1000)}:R>)`,
            inline: true
        }, {
            name: `Expires`,
            value: `${blacklistCheckUser.duration === 'Eternal' ? 'Never' : `<t:${Math.round(blacklistCheckUser.expires.getTime() / 1000)}:R>`}`,
            inline: true
        }, {
            name: 'Duration',
            value: `\`${blacklistCheckUser.duration}\``,
            inline: true
        }, {
            name: 'Reason',
            value: `${blacklistCheckUser.reason}`
        }).setFooter({
            text: `Case ID: ${blacklistCheckUser.id}`
        })]
    }).then(e => {
        return true
    })
    if (blacklistCheckGuild) return interaction.reply({
        ephemeral: true,
        embeds: [new EmbedBuilder().setColor('0x' + colours.alert).setTitle('This server has been blacklisted from using the bot.').setDescription('If you are the server owner you can appeal in the [support server](https://discord.gg/hK3gEQ2XUf)').setFields({
            name: 'Date Added',
            value: `<t:${Math.round(blacklistCheckGuild.createdAt.getTime() / 1000)}> (<t:${Math.round(blacklistCheckGuild.createdAt.getTime() / 1000)}:R>)`,
            inline: true
        }, {
            name: `Expires`,
            value: `${blacklistCheckGuild.duration === 'Eternal' ? 'Never' : `<t:${Math.round(blacklistCheckGuild.expires.getTime() / 1000)}:R>`}`,
            inline: true
        }, {
            name: 'Duration',
            value: `\`${blacklistCheckGuild.duration}\``,
            inline: true
        }, {
            name: 'Reason',
            value: `${blacklistCheckGuild.reason}`
        }).setFooter({
            text: `Case ID: ${blacklistCheckGuild.id}`
        })]
    }).then(e => {
        return true
    })
}

async function checkMaintinance(interaction) {
    const checkMain = await maintenance.findOne()
    const userProfileDev = await profileSchema.findOne({
        userId: interaction.user.id,
        developer: true
    })
    const userProfileAdmin = await profileSchema.findOne({
        userId: interaction.user.id,
        botAdmin: true
    })
    if (userProfileDev || userProfileAdmin) return
    if (checkMain) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Maintenance Mode Is Currently Active`)
                .setColor('0x' + colours.warn)
                .setDescription(`**Reason for maintenance**:\n\`\`\`fix\n${checkMain.maintenanceReason}\n\`\`\``)
            ]
        }).catch(() => {
            interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Maintenance Mode Is Currently Active`)
                    .setColor('0x' + colours.warn)
                    .setDescription(`**Reason for maintenance**:\n\`\`\`fix\n${checkMain.maintenanceReason}\n\`\`\``)
                ]
            }) 
        })
        return true
    }
}

async function verify(userId, interaction) {
    return true
}

async function cooldownCheck(userID, command, timeout, interaction) {
    const userProfileDev = await profileSchema.findOne({
        userId: interaction.user.id,
        devMode: true
    })
    if (userProfileDev) return
    if (interaction.commandName === 'claim' || interaction.commandName === 'report') {
        const checkForCooldowns = await commandCooldowns.findOne({
            userId: userID,
            command: command
        })
        if (checkForCooldowns) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle('Slow it down buddy')
                    .setDescription(`You can use this command again <t:${Math.round(checkForCooldowns.expires.getTime() / 1000)}:R>`)
                    .setColor('0x' + colours.error)
                ],
                ephemeral: true
            }).catch(() => {
                interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle('Slow it down buddy')
                        .setDescription(`You can use this command again <t:${Math.round(checkForCooldowns.expires.getTime() / 1000)}:R>`)
                        .setColor('0x' + colours.error)
                    ],
                    ephemeral: true
                })
            })
            return true
        }
        if (interaction.commandName === 'claim') {
            if (interaction.options.getSubcommand() === 'daily') {
                var dateDaily = new Date()
                dateDaily.setHours(24, 0, 0)
                var nowUTC = Date.UTC(dateDaily.getUTCFullYear(), dateDaily.getUTCMonth(), dateDaily.getUTCDate(), dateDaily.getUTCHours() - 4, dateDaily.getUTCMinutes(), dateDaily.getUTCSeconds())
                commandCooldowns.create({
                    userId: userID,
                    command: command,
                    expires: nowUTC
                })
            } else if (interaction.options.getSubcommand() === 'weekly') {
                commandCooldowns.create({
                    userId: userID,
                    command: command,
                    expires: getNextMonday()
                })

                function getNextMonday() {
                    const now = new Date()
                    const today = new Date(now)
                    today.setUTCMilliseconds(0)
                    today.setUTCSeconds(0)
                    today.setUTCMinutes(0)
                    today.setUTCHours(0)

                    const nextMonday = new Date(today)

                    do {
                        nextMonday.setUTCDate(nextMonday.getUTCDate() + 1) // Adding 1 day
                    } while (nextMonday.getUTCDay() !== 1)

                    return nextMonday
                }
            } else if (interaction.options.getSubcommand() === 'monthly') {
                commandCooldowns.create({
                    userId: userID,
                    command: command,
                    expires: getFirstDayOfNextMonth()
                })

                function getFirstDayOfNextMonth() {
                    const now = new Date()
                    const today = new Date(now)
                    today.setUTCMilliseconds(0)
                    today.setUTCSeconds(0)
                    today.setUTCMinutes(0)
                    today.setUTCHours(0)
                    today.setUTCDate(1)
                    today.setUTCMonth(now.getUTCMonth() + 1)

                    const nextMonth = new Date(today)
                    return nextMonth
                }
            }
        } else {
            const otherDate = new Date()
            otherDate.setSeconds(otherDate.getSeconds() + timeout)
            commandCooldowns.create({
                userId: userID,
                command: command,
                expires: otherDate
            })
        }
    } else {
        const result = await activeDevCoinSchema.findOne({
            userId: userID
        })
        if (result) timeout = timeout / 2
        if (!cooldowns.has(command)) {
            cooldowns.set(command, new Discord.Collection())
        }

        const current_time = Date.now()
        const time_stamps = cooldowns.get(command)
        const cooldown_amount = (timeout) * 1000

        if (time_stamps.has(userID)) {
            const expiration_time = time_stamps.get(userID) + cooldown_amount

            if (current_time < expiration_time) {
                const time_left = (expiration_time - current_time) / 1000

                seconds = Number(time_left)
                var d = Math.floor(time_left / (3600 * 24))
                var h = Math.floor(time_left % (3600 * 24) / 3600)
                var m = Math.floor(time_left % 3600 / 60)
                var s = Math.floor(time_left % 60)

                var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : ""
                var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : ""
                var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : ""
                var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : ""

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle('Slow it down buddy')
                        .setColor('0x' + colours.error)
                        .setDescription(`You must wait ${dDisplay + hDisplay + mDisplay + sDisplay} before using this again`)
                    ],
                    ephemeral: true
                }).catch(() => {
                    interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle('Slow it down buddy')
                            .setColor('0x' + colours.error)
                            .setDescription(`You must wait ${dDisplay + hDisplay + mDisplay + sDisplay} before using this again`)
                        ],
                        ephemeral: true
                    }).catch(() => {
                        interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle('Slow it down buddy')
                                .setColor('0x' + colours.error)
                                .setDescription(`You must wait ${dDisplay + hDisplay + mDisplay + sDisplay} before using this again`)
                            ],
                        })
                    })
                })
                return true
            }
        }

        time_stamps.set(userID, current_time)
        setTimeout(() => time_stamps.delete(userID), cooldown_amount)
    }
}

async function cooldownRobCheck(userID, userRobbedId, timeout, interaction) {
    const userProfileDev = await profileSchema.findOne({
        userId: interaction.user.id,
        devMode: true
    })
    if (userProfileDev) return
    const checkForCooldowns = await robCooldowns.findOne({
        userRobbedId: userRobbedId,
    })
    if (checkForCooldowns) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle('Slow it down!')
                .setURL('https://www.youtube.com/watch?v=fkkNfCkupxM')
                .setDescription(`<@${userRobbedId}> has been robbed within the past hour`)
                .setColor('0x' + colours.error)
            ],
            ephemeral: true
        })
        return true
    }
    const date = new Date()
    date.setSeconds(date.getSeconds() + timeout)
    await robCooldowns.create({
        userId: userID,
        userRobbedId: userRobbedId,
        expires: date
    })
}

async function createRecentCommand(userId, command, commandInfo, interaction, sus, staff) {
    let password = [];
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let passString
    let passWordLength = 7
    for (let i = 0; i < passWordLength; i++) {
        password.push(possible.charAt(Math.floor(Math.random() * possible.length)));
    }
    passString = password.join('')
    const expires = new Date()
    expires.setHours(expires.getHours() + 24)
    const expiresStaff = new Date()
    expiresStaff.setMonth(expiresStaff.getMonth() + 1)
    const webhookSus = new WebhookClient({
        url: "https://discord.com/api/webhooks/996501433648169081/jqOyQ0awRJMWrZHyxyLGE_sFan7Pe5V2WhOlr7KadqYY-HQULOMmiScZUugnyvYb5uwh"
    })
    const webhookStaff = new WebhookClient({
        url: "https://discord.com/api/webhooks/996503382221131836/koerD962bqjB-sMDH7j_7ZZf_tkQlnAyJ_Hb9u5kIV3OQixsUW02I9sJh3q5XHQvI2CG"
    })
    if (!sus && !staff) {
        recentCommandSchema.create({
            userId: userId,
            command: command,
            commandInfo: commandInfo,
            expires: expires,
            Id: 'A-' + passString,
            guildName: interaction.guild.name,
            guildId: interaction.guild.id
        }).catch(() => {})
    } else if (sus === true && !staff) {
        recentCommandSchema.create({
            userId: userId,
            command: command,
            commandInfo: commandInfo,
            expires: expires,
            Id: 'A-' + passString,
            guildName: interaction.guild.name,
            guildId: interaction.guild.id,
            suspicious: true
        }).catch(() => {})
        webhookSus.send({
            content: `<@&996502735031640094>,`,
            username: 'Closed Public',
            avatarURL: "https://cdn.discordapp.com/attachments/995132759309811742/1002989256035270696/closed_public_glow_no_text.png",
            embeds: [
                new EmbedBuilder()
                .setTitle(`Command: ${command}`)
                .setColor('0x' + colours.cpPurple)
                .setFields({
                    name: 'User',
                    value: `<@${userId}> (\`${userId}\`)`,
                    inline: true
                }, {
                    name: 'Command',
                    value: `Command Name: \`${command}\`\nCommand Info: \`${commandInfo}\``
                }, {
                    name: 'Guild',
                    value: `Guild Name: \`${interaction.guild.name}\`\nGuild ID: \`${interaction.guild.id}\``
                }, {
                    name: 'Alert ID',
                    value: `\`A-${passString}\``
                })
                .setFooter({
                    text: `Closed Construction`
                })
            ]
        })
    } else if (staff === true && sus === false) {
        recentCommandSchema.create({
            userId: userId,
            command: command,
            commandInfo: commandInfo,
            expires: expiresStaff,
            Id: 'A-' + passString,
            guildName: interaction.guild.name,
            guildId: interaction.guild.id,
            staffCommand: true
        }).catch(() => {})
        webhookStaff.send({
            content: `<@&996502846553993367>,`,
            username: 'Closed Public',
            avatarURL: "https://cdn.discordapp.com/attachments/995132759309811742/1002989256035270696/closed_public_glow_no_text.png",
            embeds: [
                new EmbedBuilder()
                .setTitle(`Command: ${command}`)
                .setColor('0x' + colours.cpPurple)
                .setFields({
                    name: 'User',
                    value: `<@${userId}> (\`${userId}\`)`,
                    inline: true
                }, {
                    name: 'Command',
                    value: `Command Name: \`${command}\`\nCommand Info: \`${commandInfo}\``
                }, {
                    name: 'Guild',
                    value: `Guild Name: \`${interaction.guild.name}\`\nGuild ID: \`${interaction.guild.id}\``
                }, {
                    name: 'Alert ID',
                    value: `\`A-${passString}\``
                })
                .setFooter({
                    text: `Closed Construction`
                })
            ]
        })
    } else if (sus === true && staff === true) {
        recentCommandSchema.create({
            userId: userId,
            command: command,
            commandInfo: commandInfo,
            expires: expiresStaff,
            Id: 'A-' + passString,
            guildName: interaction.guild.name,
            guildId: interaction.guild.id,
            suspicious: true,
            staffCommand: true
        }).catch(() => {})
        webhookSus.send({
            content: `<@&996502735031640094>,`,
            username: 'Closed Public',
            avatarURL: "https://cdn.discordapp.com/attachments/995132759309811742/1002989256035270696/closed_public_glow_no_text.png",
            embeds: [
                new EmbedBuilder()
                .setTitle(`Command: ${command}`)
                .setColor('0x' + colours.cpPurple)
                .setFields({
                    name: 'User',
                    value: `<@${userId}> (\`${userId}\`)`,
                    inline: true
                }, {
                    name: 'Command',
                    value: `Command Name: \`${command}\`\nCommand Info: \`${commandInfo}\``
                }, {
                    name: 'Guild',
                    value: `Guild Name: \`${interaction.guild.name}\`\nGuild ID: \`${interaction.guild.id}\``
                }, {
                    name: 'Alert ID',
                    value: `\`A-${passString}\``
                })
                .setFooter({
                    text: `Closed Construction`
                })
            ]
        })
        webhookStaff.send({
            content: `<@&996502846553993367>,`,
            username: 'Closed Public',
            avatarURL: "https://cdn.discordapp.com/attachments/995132759309811742/1002989256035270696/closed_public_glow_no_text.png",
            embeds: [
                new EmbedBuilder()
                .setTitle(`Command: ${command}`)
                .setColor('0x' + colours.cpPurple)
                .setFields({
                    name: 'User',
                    value: `<@${userId}> (\`${userId}\`)`,
                    inline: true
                }, {
                    name: 'Command',
                    value: `Command Name: \`${command}\`\nCommand Info: \`${commandInfo}\``
                }, {
                    name: 'Guild',
                    value: `Guild Name: \`${interaction.guild.name}\`\nGuild ID: \`${interaction.guild.id}\``
                }, {
                    name: 'Alert ID',
                    value: `\`A-${passString}\``
                })
                .setFooter({
                    text: `Closed Construction`
                })
            ]
        })
    }

}

async function createCommandPages(commands) {
    const commandEmbeds = []
    let k = 6
    for (let i = 0; i < commands.length; i += 6) {
        const current = commands.slice(i, k)
        let j = i
        k += 6
        let info = ``
        info = current.map(item => `**User**: <@${item.userId}> (\`${item.userId}\`)\n**Guild**: ${item.guildName} (\`${item.guildId}\`)\n**Command**: \`${item.command}\`\n**Suspicious**: ${item.suspicious === false ? 'No' : 'Yes'}\n**Alert ID**: \`${item.Id}\``).join('\n\n')
        const embed = new EmbedBuilder()
            .setColor('0x' + colours.blend)
            .setTitle(`Results`)
            .setDescription(info)
        commandEmbeds.push(embed)
    }
    return commandEmbeds
}

async function createCommandPagesById(id) {
    const commandEmbeds = []
    let k = 6
    for (let i = 0; i < id.length; i += 6) {
        const current = id.slice(i, k)
        let j = i
        k += 6
        let info = ``
        info = current.map(item => `**User**: <@${item.userId}> (\`${item.userId}\`)\n**Guild**: ${item.guildName} (\`${item.guildId}\`)\n**Command**: \`${item.command}\`\n**Suspicious**: ${item.suspicious === false ? 'No' : 'Yes'}\n**Staff Command**: ${item.staffCommand === false ? 'No' : 'Yes'}\n**Command Info**: ${item.commandInfo}\n\**Command Run**: <t:${Math.round(item.createdAt.getTime() / 1000)}> (<t:${Math.round(item.createdAt.getTime() / 1000)}:R>)\n**Expires**: <t:${Math.round(item.expires.getTime() / 1000)}:R>\n**Alert ID**: \`${item.Id}\``).join('\n\n')
        const embed = new EmbedBuilder()
            .setColor('0x' + colours.blend)
            .setTitle(`Results`)
            .setDescription(info)
        commandEmbeds.push(embed)
    }
    return commandEmbeds
}

async function createStaffPages(staff) {
    const staffEmbeds = []
    let k = 6
    for (let i = 0; i < staff.length; i += 6) {
        const current = staff.slice(i, k)
        let j = i
        k += 6
        let info = ``
        info = current.map(item => `> ${item.developer === true ? '[Developer]' : `${item.botAdmin === true ? '[Bot Admin]' : `${item.botModerator === true ? '[Bot Moderator]' : '[Regular]'}`}`} <@${item.userId}> (\`${item.userId}\`)\n> **About Me**: ${item.bio}`).join('\n\n')
        const embed = new EmbedBuilder()
            .setColor('0x' + colours.blend)
            .setTitle(`Bot Staff`)
            .setDescription(info)
        staffEmbeds.push(embed)
    }
    return staffEmbeds
}

async function createNewNotif(userId, notification) {
    let password = [];
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let passString
    let passWordLength = 7
    for (let i = 0; i < passWordLength; i++) {
        password.push(possible.charAt(Math.floor(Math.random() * possible.length)));
    }
    passString = password.join('')
    notificationSchema.create({
        userId: userId,
        notification: notification,
        Id: 'N-' + passString
    })

    await profileSchema.findOneAndUpdate({
        userId: userId,
    }, {
        hasUnreadNotif: true
    })
}

async function createNotifsPagesSmall(notifications) {
    const notifEmbeds = []
    let k = 6
    for (let i = 0; i < notifications.length; i += 6) {
        const current = notifications.slice(i, k)
        let j = i
        k += 6
        let info = ``
        info = current.map(item => `**Notification**: ${item.notification.slice(0, 50)}\n**Notification ID**: \`${item.Id}\``).join('\n\n')
        const embed = new EmbedBuilder()
            .setColor('0x' + colours.blend)
            .setTitle(`Notifications`)
            .setDescription(info)
            .setFooter({
                text: `Do /notifications show:<id> to see more info on a notification`
            })
        notifEmbeds.push(embed)
    }
    return notifEmbeds
}

async function createNotifsPagesLarge(notifications) {
    const notifEmbeds = []
    let k = 6
    for (let i = 0; i < notifications.length; i += 6) {
        const current = notifications.slice(i, k)
        let j = i
        k += 6
        let info = ``
        info = current.map(item => `**Notification**: ${item.notification}\n**Sent At**: <t:${Math.round(item.createdAt.getTime() / 1000)}> (<t:${Math.round(item.createdAt.getTime() / 1000)}:R>)\n**Notification ID**: \`${item.Id}\``).join('\n\n')
        const embed = new EmbedBuilder()
            .setColor('0x' + colours.blend)
            .setTitle(`Notifications`)
            .setDescription(info)
        notifEmbeds.push(embed)
    }
    return notifEmbeds
}

async function checkPremiumUser(userId) {
    const check = await premiumUsers.findOne({
        userId: userId
    })
    if (check) return true
}

async function checkPremiumGuild(guildId) {
    const check = await premiumGuilds.findOne({
        guildId: guildId
    })
    if (check) return true
}

async function createPremiumUser(userId, expiresInMinutes) {
    const check = await premiumUsers.findOne({
        userId: userId
    })
    const date = new Date()
    date.setMinutes(date.getMinutes() + expiresInMinutes)
    if (check) {
        check.delete()
        return await premiumUsers.create({
            userId: userId,
            expires: expiresInMinutes
        })
    }
    await premiumUsers.create({
        userId: userId,
        expires: expiresInMinutes
    })
}

async function createPremiumGuild(guildId, expiresInMinutes) {
    const check = await premiumGuilds.findOne({
        guildId: guildId
    })
    const date = new Date()
    date.setMinutes(date.getMinutes() + expiresInMinutes)
    if (check) {
        check.delete()
        return await premiumGuilds.create({
            guildId: guildId,
            expires: expiresInMinutes
        })
    }
    await premiumGuilds.create({
        guildId: userId,
        expires: expiresInMinutes
    })
}

async function genPremiumCode(creatorId, amount, plan, type) {
    let codes = []

    for (var i = 0; i < amount; i++) {
        const codePremium = voucher_codes.generate({
            pattern: "#####-#####-#####-#####",
        });

        const code = codePremium.toString().toUpperCase();

        const find = await premiumCodeSchema.findOne({
            code: code,
        });

        if (!find) {
            premiumCodeSchema.create({
                creatorId: creatorId,
                code: code,
                plan: plan,
                type: type
            });

            codes.push(`${code}`);
        }
    }

    return codes
}

async function genCodePages(codes) {
    const codeEmbeds = []
    let k = 5
    for (let i = 0; i < codes.length; i += 5) {
        const current = codes.slice(i, k)
        let j = i
        k += 5
        let info = ``
        info = current.map(item => `**Code**: \`${item.code}\`\n**Plan**: \`${item.plan}\`\n**Type**: \`${item.type}\``).join('\n\n')
        const embed = new EmbedBuilder()
            .setColor('0x' + colours.blend)
            .setTitle(`Your codes`)
            .setDescription(info)
        codeEmbeds.push(embed)
    }
    return codeEmbeds
}

async function genCodePagesStaff(codes) {
    const codeEmbeds = []
    let k = 5
    for (let i = 0; i < codes.length; i += 5) {
        const current = codes.slice(i, k)
        let j = i
        k += 5
        let info = ``
        info = current.map(item => `**Code**: \`${item.code}\`\n**User**: <@${item.creatorId}> (\`${item.creatorId}\`)\n**Plan**: \`${item.plan}\`\n**Type**: \`${item.type}\``).join('\n\n')
        const embed = new EmbedBuilder()
            .setColor('0xa744f2')
            .setTitle(`Code List`)
            .setDescription(info)
        codeEmbeds.push(embed)
    }
    return codeEmbeds
}

async function genInventoryPages(inventory) {
    const invEmbeds = []
    let k = 7
    for (let i = 0; i < inventory.length; i += 7) {
        const current = inventory.slice(i, k)
        let j = i
        k += 7
        let info = ``
        info = current.map(item => `${item.emoji} **${item.item}** (\`${item.amount.toLocaleString()}\`)\n**ID**: \`${item.itemId}\``).join('\n\n')
        const embed = new EmbedBuilder()
            .setColor('0x' + colours.blend)
            .setTitle(`Inventory`)
            .setDescription(info)
        invEmbeds.push(embed)
    }
    return invEmbeds
}

async function genReportPages(reports) {
    const reportEmbeds = []
    let k = 7
    for (let i = 0; i < reports.length; i += 7) {
        const current = reports.slice(i, k)
        let j = i
        k += 7
        let info = ``
        info = current.map(item => `**ID**: \`${item.reportId}\`\n**Status**: \`${item.status}\`\n**Created**: <t:${Math.round(item.createdAt.getTime() / 1000)}> (<t:${Math.round(item.createdAt.getTime() / 1000)}:R>)`).join('\n\n')
        const embed = new EmbedBuilder()
            .setColor('0x' + colours.blend)
            .setTitle(`Your Reports`)
            .setDescription(info)
        reportEmbeds.push(embed)
    }
    return reportEmbeds
}

async function genStaffReportPages(searchReports) {
    const reportEmbeds = []
    let k = 4
    for (let i = 0; i < searchReports.length; i += 4) {
        const current = searchReports.slice(i, k)
        let j = i
        k += 4
        let info = ``
        info = current.map(item => `**ID**: \`${item.reportId}\`\n**Type**: \`${item.type}\`\n**Status**: \`${item.status}\`\n**Reporter ID**: \`${item.reporterId}\`\n**Suspect ID**: \`${item.suspectId || 'None'}\`\n**Created**: <t:${Math.round(item.createdAt.getTime() / 1000)}> (<t:${Math.round(item.createdAt.getTime() / 1000)}:R>)\n[**Report Message**](${item.messageUrl})`).join('\n\n')
        const embed = new EmbedBuilder()
            .setColor('0x' + colours.blend)
            .setTitle(`Report List`)
            .setDescription(info)
        reportEmbeds.push(embed)
    }
    return reportEmbeds
}

async function generateCrateLoot(interaction) {
    const boxes = require('./boxes')

    let b = 0
    const lootTable = boxes[b].possibleLoot
    let roll = Math.floor(Math.random() * 100);
    let picked = null;
    let amountOfItems = Math.round(Math.random() * (boxes[b].maxItems - boxes[b].minItems) + boxes[b].minItems)
    let rewardArray = []
    for (let a = 0; a < amountOfItems; ++a) {
        for (let i = 0, len = lootTable.length; i < len; ++i) {
            const loot = lootTable[i];
            const {
                chance
            } = loot;
            if (roll < chance) {
                picked = loot;
                rewardArray.push(picked)
                break;
            }
            roll -= chance;
        }


        function removeDuplicates(arr) {
            var unique = arr.reduce(function (acc, curr) {
                if (!acc.includes(curr))
                    acc.push(curr);
                return acc;
            }, []);
            return unique;
        }
    }
}

function generateCrateLoot(boxId) {
    const boxes = require('../src/things/lootBoxes/boxes')

    let b = boxId
    const lootTable = boxes[b].possibleLoot
    let amountOfItems = Math.round(Math.random() * (boxes[b].maxItems - boxes[b].minItems) + boxes[b].minItems)
    let rewardArray = []
    for (let a = 0; a < amountOfItems; ++a) {
        let random = chooseRandom(lootTable)
        let found = false
        for (let item = 0; item < rewardArray.length; ++item) {
            if (rewardArray[item].split('|').includes(random.split('|')[0])) found = true
        }
        if (found === false) {
            rewardArray.push(random)
        }
    }
    rewardArray.push(Math.round(Math.random() * (boxes[b].maxCoins - boxes[b].minCoins) + boxes[b].minCoins))
    return rewardArray
}

function chooseRandom(lootTable) {
    let picked = null;
    let roll = Math.floor(Math.random() * 100);
    for (let i = 0, len = lootTable.length; i < len; ++i) {
        const loot = lootTable[i];
        const {
            chance
        } = loot;
        if (roll < chance) {
            picked = loot;
            let returned = picked.id + '|' + Math.round(Math.random() * (picked.max - picked.min) + picked.min)
            return returned
        }
        roll -= chance;
    }
}

function generateLootTable(boxId) {
    const boxes = require('../src/things/lootBoxes/activityTable')

    const search = !!boxes.find((value) => value.id === boxId)
    if (!search) return
    const itemFound = boxes.find((value) => value.id === boxId)

    let b = boxId
    const lootTable = itemFound.possible
    let amountOfItems = 1
    let rewardArray = []
    for (let a = 0; a < amountOfItems; ++a) {
        let random = chooseRandomItem(lootTable)
        rewardArray.push(random)
    }
    return rewardArray

    function chooseRandomItem(lootTable) {
        let picked = null;
        let roll = Math.floor(Math.random() * 100);
        for (let i = 0, len = lootTable.length; i < len; ++i) {
            const loot = lootTable[i];
            const {
                chance
            } = loot;
            if (roll < chance) {
                picked = loot;
                let returned = picked
                return returned
            }
            roll -= chance;
        }
    }
}


module.exports = {
    blacklistCheck,
    cooldownCheck,
    createRecentCommand,
    createCommandPages,
    createCommandPagesById,
    cooldownRobCheck,
    createNewNotif,
    createNotifsPagesSmall,
    createNotifsPagesLarge,
    checkMaintinance,
    createPremiumGuild,
    createPremiumUser,
    checkPremiumGuild,
    checkPremiumUser,
    genPremiumCode,
    genInventoryPages,
    createStaffPages,
    genReportPages,
    genStaffReportPages,
    genCodePages,
    genCodePagesStaff,
    verify,
    generateCrateLoot,
    generateLootTable
}
