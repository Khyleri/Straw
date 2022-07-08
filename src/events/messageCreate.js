const formatChat = require("../functions/formatChat");
module.exports = {
    name: "messageCreate",
    once: false,
    async execute(client, message) {
        if (client.debugLevel > 0)
            client.logger.log("messageCreate event", "debug");
        const execute = require("../functions/execute");
        if (!client.initialized) return;
        let guildDB;
        if (message.guild && message.channel.type !== "DM") {
            guildDB = await client.db.guildSchema.findOne({
                guildId: message.guild.id,
            });
        } else {
            guildDB = {
                prefix: client.config.defaultPrefix,
                disabled: [],
                plugins: {},
            };
        }
        if (!guildDB) return;
        const t = client.i18next.getFixedT(guildDB.lang || "en-US");
        if (
            message.channel.type === "GUILD_NEWS" &&
            guildDB.plugins?.autopublish &&
            message.crosspostable
        )
            message.crosspost();
        if (message.author.bot) return;
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators#optional_chaining_operator
        if (!client.application?.owner) await client.application?.fetch();
        if (message.channel?.partial) await message.channel.fetch();
        if (message?.partial) await message.fetch();
        if (
            message.guild &&
            guildDB.plugins.chatbot.enabled &&
            message.channel.id === guildDB.plugins.chatbot.channel &&
            process.env.CHATBOT_API
        ) {
            const chatBotUrl = `http://api.brainshop.ai/get?bid=159117&key=${
                process.env.CHATBOT_API
            }&uid=${encodeURIComponent(
                message.author.id
            )}&msg=${encodeURIComponent(message.content)}`;
            if (client.debug) client.logger.log("Chatbot", "debug");
            message.content = message.content
                .replace(/@(everyone)/gi, "everyone")
                .replace(/@(here)/gi, "here");
            if (message.content.includes(`@`)) {
                return message.reply(`**Hey, Please don't mention anyone**`);
            }
            const chat = await require("node-fetch")(chatBotUrl).then((res) =>
                res.json()
            );
            message.reply(
                `${
                    chat?.cnt
                        ? formatChat(chat.cnt)
                        : "Error: No message provided"
                }`
            );
        }
        if (client.debug && client.debugLevel > 0)
            client.logger.log("running execute func", "debug");
        try {
            execute(message, guildDB);
        } catch (e) {
            client.logger.log(e, "error");
        }
        if (client.debug && client.debugLevel > 0)
            client.logger.log("finished running execute func", "debug");

        const mentionRegex = new RegExp(
            `^(<@!?${message.client.user.id}>)\\s*`
        );
        if (message.content.split(" ").length > 1) return;

        if (!mentionRegex.test(message.content)) return;
        let reply = `Salut, ${
            message.author
        }\nJe suis Fraise\nMon prefix est "${guildDB.prefix}"${
            message.guild ? " sur ce serveur." : ""
        }\nEnvoie \`${guildDB.prefix}help\` pour afficher le message d'aide`;
        if (message.guild) {
            reply += `\Envoie \`${guildDB.prefix}follow #salon\` où #salon est le salon sur lequel vous souhaitez recevoir les mises à jour.`;
        }
        if (!message.reference) {
            message.channel.sendTyping().catch(() => {});
            message.channel.send(reply);
        } else {
            message.channel.messages
                .fetch(message.reference.messageId)
                .then((msg) => {
                    if (msg.author.id !== client.user.id) {
                        message.channel.sendTyping();
                        message.channel.send(reply);
                    }
                })
                .catch(console.error);
        }
    },
};
