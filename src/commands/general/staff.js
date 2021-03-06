/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
//eslint-disable-next-line no-unused-vars
const { Embed, Command } = require("../../classes");
const { Permissions } = require("discord.js");
module.exports = class CMD extends Command {
    constructor(client) {
        super(
            {
                name: "staff",
                aliases: ["server-staff"],
                memberPerms: [],
                botPerms: [],
                requirements: {
                    guildOnly: true,
                },
                disabled: false,
                cooldown: 10,
                category: "General",
                slash: true,
            },
            client
        );
    }

    //eslint-disable-next-line no-unused-vars
    async execute({ message }, t) {
        await message.guild.members.fetch();
        const embed = this.buildEmbed(message.guild, t);
        message.channel.send({ embeds: [embed] });
    }

    //eslint-disable-next-line no-unused-vars
    async run({ interaction }, t) {
        await interaction.guild.members.fetch();
        const embed = this.buildEmbed(interaction.guild, t);
        interaction.followUp({ embeds: [embed] });
    }

    buildEmbed(guild, t) {
        const administrators = guild.members.cache.filter(
            (m) =>
                m.permissions.has(Permissions.FLAGS.ADMINISTRATOR) &&
                !m.user.bot
        );
        const moderators = guild.members.cache.filter(
            (m) =>
                !administrators.has(m.id) &&
                m.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) &&
                !m.user.bot
        );
        const embed = new Embed()
            .setAuthor(`${guild.name} ${t("misc:staff")}`)
            .addField(
                t("misc:admins"),
                administrators.size > 0
                    ? administrators
                          .map(
                              (a) =>
                                  `${this.getStatusEmoji(
                                      a?.presence?.status
                                  )} ${a.user.tag}`
                          )
                          .join("\n")
                    : t("misc:no_admins")
            )
            .addField(
                t("misc:mods"),
                moderators.size > 0
                    ? moderators
                          .map(
                              (m) =>
                                  `${this.getStatusEmoji(
                                      m?.presence?.status
                                  )} ${m.user.tag}`
                          )
                          .join("\n")
                    : t("misc:no_mods")
            );
        return embed;
    }
};
