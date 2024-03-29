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
                `<:informations:992944832223907940> ${t("categories:general")}`,
                `<:statistiques:992932546205720738> ${t("misc:servers")}: ${counts.totalGuilds} serveurs\n` +
                    `<:statistiques:992932546205720738> Utisilateurs: ${counts.totalMembers} utilisateurs\n` +
                    `<:statistiques:992932546205720738> ${t("misc:channels")}: ${
                        message.client.channels.cache.size
                    } channels\n` +
                    `> Version: ${message.client.package.version}\n` +
                    `> Commandes: ${message.client.commands.enabled.size} commandes\n` +
                    `> ${message.client.customEmojis.online} ${t(
                        "misc:uptime"
                    )}: ${duration}`
            )
            .addField(
                `<:informations:992944832223907940> ${t("misc:system")}`,
                `${message.client.customEmojis.nodejs} Node: ${process.version}\n` +
                    `${message.client.customEmojis.djs} Discord.js: v${version}\n` +
                    `${message.client.customEmojis.ram} ${t(
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
                    `<:informations:992944832223907940> Propriétaire & Staff`,
                    `<:couronne:992932264394641470> **Propriétaire:** ${this.client.ownersTags.join(
                        ", "
                    )}\n<:devellopers:992932464588755034> **Équipe Straw:** ${this.client.staffTags.join(
                        ", "
                    )}`
                )
                .addField(
                    "<:vote:992935147169120376> Voter pour Straw:",
                    "<:lien:992935195353292810> [top.gg](https://top.gg/bot/855107430693077033/vote)\n",
                    inline
                );
        }
        embed
            .addField(
                "<:informations:992944832223907940> Liens Utiles:",
                `<:lien:992935195353292810> [Serveur Communautaire](${message.client.config.supportGuildInvite})\n`,
                inline
            )
            .setImage(
                ""
            );
        switch (args[0]) {
            case "--dm":
                message.author.send({ embeds: [embed] });
                message.reply(`Regarde tes messages privée, ${message.author}`);
                break;
            default:
                message.reply({ embeds: [embed] });
                break;
        }
    }
};
