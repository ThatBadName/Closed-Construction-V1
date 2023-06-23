const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const profileSchema = require('../../models/userProfile')
const { colours } = require('../../things/constants')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stats')
    .setDMPermission(false)
    .setDescription('Get stats about the bot'),

    async execute(interaction, client) {
        const functions = require('../../commandFunctions')
        const blks = await functions.blacklistCheck(interaction.user.id, interaction.guild.id, interaction)
        if (blks === true) return
        const main = await functions.checkMaintinance(interaction)
        if (main === true) return

        const cldn = await functions.cooldownCheck(interaction.user.id, 'stats', 3, interaction)
        if (cldn === true) return
        functions.createRecentCommand(interaction.user.id, 'stats', `None`, interaction)

        const message = await interaction.deferReply({
            fetchReply: true
        })
                const registeredUserCount = await profileSchema.find()
                const highestBank = await profileSchema.findOne({showOnLeaderboards: true}).sort({bank: -1})
                const highestWallet = await profileSchema.findOne({showOnLeaderboards: true}).sort({wallet: -1})
        
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle('Bot Stats!')
                        .setColor(16777215)
                        .setFields({
                            name: 'Ping',
                            value: `API Latency: \`${client.ws.ping}\`ms\nClient Ping: \`${message.createdTimestamp - interaction.createdTimestamp}\`ms`,
                            inline: true
                        }, {
                            name: 'Counts',
                            value:
                                `Registered Users: \`${registeredUserCount.length}\`\n` +
                                `Most Coins In Wallet: \`${round(highestWallet.wallet).toLocaleString()}\` (<@${highestWallet.userId}>)\n` +
                                `Most Coins In Bank: \`${round(highestBank.bank).toLocaleString()}\` (<@${highestBank.userId}>)\n` +
                                `\n(doesnt work) Servers: \-\`\nUsers: \`-\`\nShard: \`${interaction.guild.shard.id.toLocaleString()}/${client.shard.ids.length.toLocaleString() - 1}\``
                        })
                    ]
                })

    }
}

function round(x)
{
    return Math.round(x/10000)*10000
}
