# MINEFLAYER BOT

Simple bot that can do nearly everything you want

## About

It's a JavaScript bot I put together from various pieces of code from various sources that can do almost anything you need it to do. The function you need can be programmed for later use. It is based on the [Mineflayer](https://github.com/PrismarineJS/mineflayer/blob/master/docs/README.md) library. Documentation on how to use its functions [here](https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md).

## How to use

Run command line in the folder with the downloaded files and type `npm install` to install all dependencies. This command is written once and is not used further. Make sure you have NodeJS installed.

Next, in the same command line, type `node main.js --username BotUsername --ip ServerIP --port ServerPort --owner`. This will launch the file if there are no problems with installing dependencies.

You **do not** need to enter any arguments except **owner**. If you don't enter them, the default values (nickname: 'Bot', ip: localhost, port: 25565) will be applied.

Owner is the nickname of the player whose commands this bot will listen to. If you don't enter this argument, it will just give an error when you try to give a command to the bot

For example:

> node main.js --MyBot --ip mc.hypixel.net --port 25565 --owner --owner PussyHunter666

## Shortcomings

On servers where player nicknames come after the name of the clan, prefix, separated by some symbols, and similar, may not work recognizing nickname because of what will not respond to player commands. On local servers or servers without plugins for chat all works stably (tested)

