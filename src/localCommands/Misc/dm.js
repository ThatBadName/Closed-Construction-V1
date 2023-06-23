const {
  SlashCommandBuilder,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  ButtonBuilder
} = require("discord.js");
const {
  colours
} = require('../../things/constants')
const functions = require('../../commandFunctions')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDMPermission(false)
    .setDescription('DM a user')
    .addStringOption(option =>
      option.setName('user')
      .setDescription('The ID of the user to DM')
      .setRequired(true)
      .setMinLength(10)
      .setMaxLength(25)
    ),

  async execute(interaction, client) {
    const checkForUser = await client.users.fetch(interaction.options.getString('user'))
    if (!checkForUser) return interaction.reply({
      embeds: [
        new EmbedBuilder()
        .setTitle('Could not find user')
        .setDescription(`I am not in a server with any user that has the ID: \`${interaction.options.getString('user')}\``)
        .setColor(16777215)
      ],
      ephemeral: true
    })

    let firstTextBox
    let customPriceModal = new ModalBuilder()
      .setTitle('Message')
      .setCustomId('custom-modal')

    const price = new TextInputBuilder()
      .setCustomId('message')
      .setLabel('What do you want to send')
      .setMinLength(1)
      .setMaxLength(1000)
      .setRequired(true)
      .setStyle('Paragraph')

    firstTextBox = new ActionRowBuilder().addComponents(price)
    customPriceModal.addComponents(firstTextBox)
    interaction.showModal(customPriceModal)
    await interaction.awaitModalSubmit({
        time: 300000
      }).catch(() => {
        interaction.followUp({
          embeds: [
            new EmbedBuilder()
            .setTitle('You took too long to submit the modal')
          ],
          components: [],
          ephemeral: true
        })
      })
      .then(async (i) => {
        if (!i) return
        let message = i.fields.getTextInputValue('message')

        let failed = false
        let password = [];
        let possible = 'abcdefghijklmnopqrstuvwxyz0123456789'
        let passString
        let passWordLength = 7
        for (let i = 0; i < passWordLength; i++) {
          password.push(possible.charAt(Math.floor(Math.random() * possible.length)));
        }
        passString = password.join('')

        await checkForUser.send({
          embeds: [
            new EmbedBuilder()
            .setColor(16777215)
            .setTitle('You have been sent a message')
            .setDescription(message)
            .setFooter({text: `This is an official message sent by the staff of ${client.user.username}. If you want to report abuse of this system please do so in the support server (ID: ${passString})`})
          ],
          components: [
            new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
              .setDisabled(true)
              .setStyle('Link')
              .setURL('https://google.com/')
              .setLabel(`Sent by ${interaction.user.tag}`)
            )
          ]
        })
        .catch((err) => { failed = true })
        if (failed === true) return i.reply({
          embeds: [
            new EmbedBuilder()
            .setTitle('Something went wrong')
            .setDescription(`This user may not have their DMs enabled`)
            .setColor(16777215)
          ],
          ephemeral: true
        })
        functions.createRecentCommand(interaction.user.id, `dm-${passString}`, `MESSAGE: ${message}`, interaction, false, true)
        i.reply({
          embeds: [
            new EmbedBuilder()
            .setTitle('Message sent')
            .setDescription(`I have sent a message to \`${checkForUser.tag}\` (\`${checkForUser.id}\`)\n\n${message}`)
            .setColor(16777215)
          ],
          ephemeral: true
        })
      })
  }
}