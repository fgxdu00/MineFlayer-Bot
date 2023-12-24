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

> node main.js --username MyBot --ip mc.hypixel.net --port 25565 --owner --owner PussyHunter666


### Update


Added start.bat for convenient start of the bot, as well as the terminal, where you can enter messages as in the regular chat game

For a correct start you also need to edit the start parameters in the start.bat file. To do this, you need to run it in any text editor and enter your start parameters in the line `set mainParams=here` instead of the word "here".

For example:

> set mainParams=--username MyBot --ip mc.hypixel.net --port 25565 --owner --owner PussyHunter666


## **"Major" update**


All chat, including message entry, is now in the UI, written in Python. I added a new startNew.bat startup file, but left the old startup option as well.

Start main.js first, then gui.py (or client.js (old version)).
Remember that to run gui.py you will need to install Python and dependencies for it too.

No time to add a requirements.txt file (imported libraries change frequently). It will be implemented in future updates


## Shortcomings


On servers where player nicknames come after the name of the clan, prefix, separated by some symbols, and similar, may not work recognizing nickname because of what will not respond to player commands. On local servers or servers without plugins for chat all works stably (tested)



# Russian translate | Русский перевод



# MINEFLAYER BOT


Простой бот, который может делать почти все, что вы хотите.


## About


Это бот на JavaScript, который я собрал из различных кусков кода из разных источников и который может делать практически все, что вам нужно. Нужная функция может быть запрограммирована для последующего использования. Он основан на библиотеке [Mineflayer](https://github.com/PrismarineJS/mineflayer/blob/master/docs/README.md). Документация по использованию ее функций [здесь](https://github.com/PrismarineJS/mineflayer/blob/master/docs/api.md).


## Как использовать

Запустите командную строку в папке со скачанными файлами и введите `npm install` для установки всех зависимостей. Эта команда пишется один раз и в дальнейшем не используется. Убедитесь, что у вас установлен NodeJS.

Далее в той же командной строке введите `node main.js --username BotUsername --ip ServerIP --port ServerPort --owner`. Это запустит файл, если не возникнет проблем с установкой зависимостей.


Вам **не нужно** вводить никаких аргументов, кроме **owner**. Если вы не введете их, будут применены значения по умолчанию (ник: 'Bot', ip: localhost, порт: 25565).

Owner - это ник игрока, чьи команды будет слушать бот. Если вы не укажете этот аргумент, то при попытке отдать команду боту будет выдана ошибка.

Например:

> node main.js --username MyBot --ip mc.hypixel.net --port 25565 --owner --owner PussyHunter666


### Обновление

Добавлен start.bat для удобного запуска бота, а также терминал, в котором можно вводить сообщения, как в обычном чате игры.

Для корректного запуска также необходимо отредактировать параметры запуска в файле start.bat. Для этого нужно запустить его в любом текстовом редакторе и в строке `set mainParams=here` вместо слова "here" ввести свои параметры запуска.

Например:

> set mainParams=--username MyBot --ip mc.hypixel.net --port 25565 --owner --owner PussyHunter666


## **"Крупное" обновление**


Теперь весь чат, включая ввод сообщений, находится в пользовательском интерфейсе, написанный на Python. Добавил новый файл запуска startNew.bat, но оставил и старый вариант запуска.
Запускать сперва файл main.js, а потом gui.py (или client.js (старый вариант))

Помните, что для запуска gui.py потребуется установить Python и зависимости и для него тоже.

Файл requirements.txt добавлять времени нет (импортированные библиотеки часто меняются). Будет реализовано в будущих обновлениях


## Недостатки


На серверах, где ники игроков идут после названия клана, префикса, разделенны какими-либо символами, и подобные им может не работать распознавая ника, из-за чего бот не будет реагировать на команды игрока. На локальных серверах или серверах без плагинов для чата все работает стабильно (проверено)