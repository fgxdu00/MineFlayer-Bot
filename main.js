const mineflayer = require('mineflayer')
const yargs = require('yargs');
const pvp = require('mineflayer-pvp').plugin
const {
    pathfinder,
    Movements,
    goals
} = require('mineflayer-pathfinder')
const GoalFollow = goals.GoalFollow
const armorManager = require('mineflayer-armor-manager')
const autoeat = require('mineflayer-auto-eat').plugin
const collectBlock = require('mineflayer-collectblock').plugin
const mineflayerViewer = require('prismarine-viewer').mineflayer
const {
    GoalBlock
} = require('mineflayer-pathfinder').goals
const chalk = require('chalk')
const repl = require('repl');
const readline = require('readline');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const windows = require('prismarine-windows').windows;
optimization: {
    minimizer: [
        new UglifyJSPlugin({
            uglifyOptions: {
                compress: {
                    drop_console: true,
                }
            }
        })
    ]
}
const radarPlugin = require('mineflayer-radar')(mineflayer);
var options = {
    host: '0.0.0.0', // optional
    port: 3008, // optional
}

const {
    autototem
} = require('mineflayer-auto-totem')


const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({
    server
});

const argv = yargs
  .option('username', {
    alias: 'u',
    describe: 'Bot username',
    type: 'string',
  })
  .option('ip', {
    alias: 'i',
    describe: 'Server IP address',
    type: 'string',
  })
  .option('port', {
    alias: 'p',
    describe: 'Server port',
    type: 'number',
  })
  .argv;

const bot = mineflayer.createBot({
  host: argv.ip || 'localhost',
  port: argv.port || 25565,
  username: argv.username || 'Bot',
});

radarPlugin(bot, options);

// Serve the HTML file
app.use(express.static('public'));

// WebSocket connection handling
wss.on('connection', (ws) => {
    // Forward bot messages to the client
    bot.on('message', (message) => {
        ws.send(JSON.stringify({
            type: 'chat',
            message: message.toAnsi()
        }));
    });

    // Handle incoming messages from the client (if needed)
    ws.on('message', (message) => {
        // Handle client messages if necessary
    });
});

// Start the server
const PORT = process.env.PORT || 5500;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Handle bot events or commands here
bot.on('login', () => {
    console.log('Bot logged in');
});



bot.loadPlugin(autototem)
bot.loadPlugin(pvp)
bot.loadPlugin(armorManager)
bot.loadPlugin(pathfinder)
bot.loadPlugin(autoeat)
bot.loadPlugin(collectBlock)

bot.once('spawn', () => {
    mineflayerViewer(bot, {
        port: 3007,
        firstPerson: true
    })
})

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    // Пример: присвоить введенное значение переменной
    let userInput = input;
    if (userInput === "playerList") {
        displayPlayerList()
    } else {
        bot.chat(userInput);
    };
});

// Пример обработки события завершения ввода (Ctrl+C)
rl.on('close', () => {
    console.log('Процесс ввода завершен.');
    bot.quit(); // Возможно, вы захотите добавить здесь более сложную логику завершения
});

bot.on('error', (error) => {
    console.error('Bot error:', error);
});

bot.once('spawn', function () {
    bot.setQuickBarSlot(0);
    bot.activateItem(false);
    bot.on("windowOpen", window => {
        bot.clickWindow(20, 0, 0)
    })
    // setTimeout(() => {
    //   console.log(chalk.gray.underline('teleported to spawn automatically'))
    //   bot.chat('/spawn')
    // }, 10000);
    setTimeout(() => {
        console.log(chalk.gray.underline('sit'))
        bot.chat('/sit')
    }, 10000);
});

// Функция для отображения списка игроков
function displayPlayerList() {
    const playerList = Object.keys(bot.players).map((username) => bot.players[username].username);
    console.log('Список игроков:', playerList);
}

bot.on('login', () => {
    setTimeout(() => {
        console.log('Бот успешно запущен!');
        displayPlayerList();
    }, 3000)
});

bot.once('windowOpen', function (window) {
    // Check if it's the correct window and has an 'id' property
    if (window && window.id) {
        console.log(window.containerItems());
        setTimeout(() => {
            bot.closeWindow(window);
        }, 1000); // Adjust the timeout value as needed
    } else {
        console.error('Invalid or unexpected window:', window);
    }
});

bot.on('end', () => {
    console.log(chalk.red.underline('Disconnected'))
    bot.quit()
})

bot.on('message', (message) => {
    console.log(message.toAnsi())
})

function useInvsee(username, showEquipment, message) {
    bot.once('windowOpen', (window) => {
        const count = window.containerItems().length
        const what = showEquipment ? 'equipment' : 'inventory items'
        if (count) {
            bot.chat(`${username}'s ${what}:`)
            sayItems(window.containerItems())
        } else {
            bot.chat(`${username} has no ${what}`)
        }
    })
    if (message === `invsee ${bot.username}`) {
        console.log('не понятно крч чо там')
    } else {
        if (showEquipment) {
            bot.chat(`/invsee ${username} 1`)
        } else {
            bot.chat(`/invsee ${username}`)
        }
    }
}

function sayItems(items = bot.inventory.items()) {
    const output = items.map(itemToString).join(', ')
    if (output) {
        bot.chat(output)
    } else {
        bot.chat('empty')
    }
}

function itemToString(item) {
    if (item) {
        return `${item.name} x ${item.count}`
    } else {
        return '(nothing)'
    }
}

function itemByType(items, type) {
    let item
    let i
    for (i = 0; i < items.length; ++i) {
        item = items[i]
        if (item && item.type === type) return item
    }
    return null
}

function itemByName(items, name) {
    let item
    let i
    for (i = 0; i < items.length; ++i) {
        item = items[i]
        if (item && item.name === name) return item
    }
    return null
}

bot.once('spawn', () => {
    mineflayerViewer(bot, {
        port: 3000
    })
    bot.on('path_update', (r) => {
        const nodesPerTick = (r.visitedNodes * 50 / r.time).toFixed(2)
        console.log(`I can get there in ${r.path.length} moves. Computation took ${r.time.toFixed(2)} ms (${nodesPerTick} nodes/tick). ${r.status}`)
        const path = [bot.entity.position.offset(0, 0.5, 0)]
        for (const node of r.path) {
            path.push({
                x: node.x,
                y: node.y + 0.5,
                z: node.z
            })
        }
        bot.viewer.drawLine('path', path, 0xff00ff)
    })

    const mcData = require('minecraft-data')(bot.version)
    const defaultMove = new Movements(bot, mcData)

    bot.viewer.on('blockClicked', (block, face, button) => {
        if (button !== 2) return // only right click

        const p = block.position.offset(0, 1, 0)

        bot.pathfinder.setMovements(defaultMove)
        bot.pathfinder.setGoal(new GoalBlock(p.x, p.y, p.z))
    })
})

bot.on('spawn', () => {
    bot.autoEat.options = {
        priority: 'foodPoints',
        startAt: 10,
        bannedFood: []
    }
})

bot.on('playerCollect', (collector, itemDrop) => {
    if (collector !== bot.entity) return

    setTimeout(() => {
        const sword = bot.inventory.items().find(item => item.name.includes('sword'))
        if (sword) bot.equip(sword, 'hand')
    }, 150)
})

bot.on('playerCollect', (collector, itemDrop) => {
    if (collector !== bot.entity) return

    setTimeout(() => {
        const shield = bot.inventory.items().find(item => item.name.includes('shield'))
        if (shield) bot.equip(shield, 'off-hand')
    }, 250)
})

let guardPos = null

function guardArea(pos) {
    guardPos = pos.clone()

    if (!bot.pvp.target) {
        moveToGuardPos()
    }
}

function stopGuarding() {
    guardPos = null
    bot.pvp.stop()
    bot.pathfinder.setGoal(null)
}

function moveToGuardPos() {
    const mcData = require('minecraft-data')(bot.version)
    bot.pathfinder.setMovements(new Movements(bot, mcData))
    bot.pathfinder.setGoal(new goals.GoalBlock(guardPos.x, guardPos.y, guardPos.z))
}

bot.on('stoppedAttacking', () => {
    if (guardPos) {
        moveToGuardPos()
    }
})

bot.on('physicsTick', () => {
    if (bot.pvp.target) return
    if (bot.pathfinder.isMoving()) return

    const entity = bot.nearestEntity()
    // if (entity) bot.lookAt(entity.position.offset(0, entity.height, 0))
})

bot.on('physicsTick', () => {
    if (!guardPos) return

    const filter = e => e.type === 'mob' && e.position.distanceTo(bot.entity.position) < 16 &&
        e.mobType !== 'Armor Stand' // Mojang classifies armor stands as mobs for some reason?

    const entity = bot.nearestEntity(filter)
    if (entity) {
        bot.pvp.attack(entity)
    }
})

bot.on('physicsTick', async () => {
    bot.autototem.equip()
})

bot.on('chat', (username, message) => {
    if (username === bot.username) return

    switch (true) {
        case /^invsee \w+( \d)?$/.test(message): {
            const command = message.split(' ')
            useInvsee(command[1], command[0])
            break
        }
    }

    if (username === 'SmellOfBebra') {
        const mcData = require('minecraft-data')(bot.version)
        const args = message.split(' ')
        if (args[0] == 'Собери') {

            // Get the correct block type
            const blockType = mcData.blocksByName[args[1]]
            if (!blockType) {
                bot.chat("Не знаю такого блока")
                return
            }

            // Try and find that block type in the world
            const block = bot.findBlock({
                matching: blockType.id,
                maxDistance: 64
            })

            if (!block) {
                bot.chat("Не вижу таких поблизости")
                return
            }

            bot.chat('Собираю ближний ' + blockType.name)

            // Collect the block if we found one
            bot.collectBlock.collect(block, err => {
                if (err) bot.chat(err.message)
            })
        }

        if (message === 'охраняй') {
            const player = bot.players[username]

            if (!player) {
                bot.chat("Не могу тебя найти")
                return
            }

            bot.chat('Бля пизда всем нахуй бляяяя')
            guardArea(player.entity.position)
        }

        if (message.indexOf('пиши ') !== -1) {
            var replacement = "пиши ",
                toReplace = "",
                str = message

            str = str.replace(replacement, toReplace)
            bot.chat(str)
        }
        if (message.indexOf('ходи ') !== -1) {
            var replacement = "ходи ",
                toReplace = "",
                str = message

            str = str.replace(replacement, toReplace)
            const player = bot.players[str]

            if (!player) {
                bot.chat("Не могу найти")
                return
            }

            const goal = new GoalFollow(player.entity, 1)
            bot.pathfinder.setGoal(goal, true)
        }

        if (message.indexOf('дерись ') !== -1) {
            var replacement = "дерись ",
                toReplace = "",
                str = message

            str = str.replace(replacement, toReplace)
            const player = bot.players[str]

            if (!player) {
                bot.chat("Бля а где нахуй?")
                return
            }

            bot.chat('Ща отпизжу')
            bot.pvp.attack(player.entity)
        }

        if (message === 'стоп') {
            bot.chat('ok')
            stopGuarding()
        }
        if (message === 'выкинь') {
            function tossNext() {
                if (bot.inventory.items().length === 0)
                    return
                const item = bot.inventory.items()[0]
                bot.tossStack(item, tossNext)
            }
            tossNext()
        }
    }
})