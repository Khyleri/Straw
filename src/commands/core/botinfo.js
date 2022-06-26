/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
//eslint-disable-next-line no-unused-vars
const { Embed, Command } = require("../../classes");
const moment = require("moment");
require("moment-duration-format");
const { version } = require("discord.js");
module.exports = class CMD extends Command {
    constructor(client) {
        super(
            {
                name: "botinfo",
                aliases: ["bi", "binfo", "info", "stats", "about"],
                memberPerms: [],
                botPerms: [],
                usage: "(--dm)",
                disabled: false,
                cooldown: 5,
                category: "Core",
            },
            client
        );
    }

    async execute({ message, args, guildDB }, t) {
        //TODO: Add translation
        if (args[0]) {
            args[0] = args[0].toLowerCase();
        }
        moment.locale(guildDB.lang ? guildDB.lang.toLowerCase() : "en-US");
        const promises = [
            this.client.shard.fetchClientValues("guilds.cache.size"),
            this.client.shard.broadcastEval((c) =>
                c.guilds.cache.reduce(
                    (acc, guild) => acc + guild.memberCount,
                    0
                )
            ),
        ];
        const duration = moment
            .duration(this.client.uptime)
            .format(" D [days], H [hrs], m [mins], s [secs]");
        const counts = await Promise.all(promises).then((results) => {
            const totalGuilds = results[0].reduce(
                (acc, guildCount) => acc + guildCount,
                0
            );
            const totalMembers = results[1].reduce(
                (acc, memberCount) => acc + memberCount,
                0
            );
            return { totalGuilds, totalMembers };
        });
        const inline = true;
        const embed = new Embed({
            color: "success",
            timestamp: true,
            footer: t("cmds:botinfo.footer"),
        })
            .setTitle(
                `${message.client.user.username} v${message.client.package.version}`
            )
            .setDescription(`${this.client.application.description}`)
            .addField(
                `:pencil: __${t("categories:general")}__`,
                `> ${t("misc:servers")}: ${counts.totalGuilds} servers\n` +
                    `> Users: ${counts.totalMembers} users\n` +
                    `> ${t("misc:channels")}: ${
                        message.client.channels.cache.size
                    } channels\n` +
                    `> Version: ${message.client.package.version}\n` +
                    `> Commands: ${message.client.commands.enabled.size} commands\n` +
                    `> ${message.client.customEmojis.online} ${t(
                        "misc:uptime"
                    )}: ${duration}`
            )
            .addField(
                `:gear: __${t("misc:system")}__`,
                `> ${message.client.customEmojis.nodejs} Node: ${process.version}\n` +
                    `> ${message.client.customEmojis.djs} Discord.js: v${version}\n` +
                    `> ${message.client.customEmojis.ram} ${t(
                        "misc:ram_used"
                    )}: \`${(
                        process.memoryUsage().heapUsed /
                        1024 /
                        1024
                    ).toFixed(2)}MB\``
            );
        if (!args[0] || args[0] !== "--short") {
            embed
                .addField(
                    `${message.client.customEmojis.owner} Bot owners and staff`,
                    `**Straw owners:** ${this.client.ownersTags.join(
                        ", "
                    )}\n**Straw staff:** ${this.client.staffTags.join(
                        ", "
                    )}`
                )
                .addField(
                    "🧾 Voter pour Straw:",
                    "> [top.gg](https://top.gg/bot/848459799783669790)\n",
                    inline
                );
        }
        embed
            .addField(
                "🔗 Liens Utiles:",
                `> [Support server](${message.client.config.supportGuildInvite})\n`,
                inline
            )
            .setImage(
                ""
            );
        switch (args[0]) {
            case "--dm":
                message.author.send({ embeds: [embed] });
                message.reply(`Check out your DMs, ${message.author}`);
                break;
            default:
                message.reply({ embeds: [embed] });
                break;
        }
    }
};
