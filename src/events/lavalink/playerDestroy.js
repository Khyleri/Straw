/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
module.exports = {
    name: "playerDestroy",
    once: false,
    execute(client, player) {
        if (client.debug)
            client.logger.debug(`A player was destoryed in ${player.guild}.`);
    },
};