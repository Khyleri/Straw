# Commands - Discord Welcome bot

> Prefix: `!w`

If You're not sure what prefix is used can you just `@-mention` the bot (`@welcome-bot#0914`) and it will tell you what prefix is used.

These are the commands currently available:
- `ping` - Ping the bot.
- `test` - Test by sending welcome message
- `set`
    - `chan` - Set welcome channel (channel to send welcome message)
    - `msg` - Set welcome message
- `get`
    - `chan` - Get current welcome channel
    - `msg` - Get current welcome message

All these commands should be prefixed with the `prefix` (`!w`) i.e. for command `ping` you have to send `!w ping` in the channel the bot has perms to read and send messages.

In some of these you will see under a command their is a command, to execute those, send `command subcommand args` where `command` is the command, `subcommand` is the subcommand and `args` are the argument(s)

Example usage of subcommand: `!w set msg Welcome {mention}!`