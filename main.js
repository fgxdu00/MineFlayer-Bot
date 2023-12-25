// Import settings
const config = require('./settings.json')

//Import bot dependencies
const mineflayer = require('mineflayer')
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
const { GoalBlock, GoalXZ } = require('mineflayer-pathfinder').goals;
const {
    autototem
} = require('mineflayer-auto-totem')
const radarPlugin = require('mineflayer-radar')(mineflayer);
var options = {
    host: '0.0.0.0',
    port: 3008,
}

//Import terminal styling
const chalk = require('chalk')
const readline = require('readline');

//Creating bot
const bot = mineflayer.createBot({
    host: config.server.ip,
    port: config.server.port,
    username: config['bot-setup']['username'],
    version: config.server.version,
});

bot.loadPlugin(autototem)
bot.loadPlugin(pvp)
bot.loadPlugin(armorManager)
bot.loadPlugin(pathfinder)
bot.loadPlugin(autoeat)
bot.loadPlugin(collectBlock)
radarPlugin(bot, options);

const {
    spawn
} = require('child_process');

bot.once('spawn', () => {
    mineflayerViewer(bot, {
        port: 3007,
        firstPerson: true
    })
    const pythonProcess = spawn('python', ['gui.py']);

    pythonProcess.on('close', (code) => {
        console.log(`Exit code: ${code}`);
    });

    pythonProcess.on('error', (err) => {
        console.error('Child process error: ', err);
    });

    process.on('exit', (code) => {
        console.log(`Main process exit code: ${code}`);
    });

    if (config.utils['anti-afk'].enabled) {
        if (config.utils['anti-afk'].sneak) {
            bot.setControlState('sneak', true);
        }

        if (config.utils['anti-afk'].jump) {
            bot.setControlState('jump', true);
        }

        if (config.utils['anti-afk']['hit'].enabled) {
            let delay = config.utils['anti-afk']['hit']['delay'];
            let attackMobs = config.utils['anti-afk']['hit']['attack-mobs']

            setInterval(() => {
                if (attackMobs) {
                    let entity = bot.nearestEntity(e => e.type !== 'object' && e.type !== 'player' &&
                        e.type !== 'global' && e.type !== 'orb' && e.type !== 'other');

                    if (entity) {
                        bot.attack(entity);
                        return
                    }
                }

                bot.swingArm("right", true);
            }, delay);
        }

        if (config.utils['anti-afk'].rotate) {
            setInterval(() => {
                bot.look(bot.entity.yaw + 1, bot.entity.pitch, true);
            }, 100);
        }
    }
});

function circleWalk(bot, radius) {
    // Make bot walk in square with center in bot's  wthout stopping
    return new Promise(() => {
        const pos = bot.entity.position;
        const x = pos.x;
        const y = pos.y;
        const z = pos.z;

        const points = [
            [x + radius, y, z],
            [x, y, z + radius],
            [x - radius, y, z],
            [x, y, z - radius],
        ];

        let i = 0;
        setInterval(() => {
            if (i === points.length) i = 0;
            bot.pathfinder.setGoal(new GoalXZ(points[i][0], points[i][2]));
            i++;
        }, 1000);
    });
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    let userInput = input;
    if (userInput === "playerList") {
        displayPlayerList()
    } else if (userInput === "connect") {
        connection();
    } else {
        bot.chat(userInput);
    };
});


rl.on('close', () => {
    console.log('Entry process is complete');
    bot.quit();
});

bot.on('error', (error) => {
    console.error('Bot error:', error);
});

function connection() {
    bot.setQuickBarSlot(0);
    bot.activateItem(false);
    bot.on("windowOpen", window => {
        bot.clickWindow(20, 0, 0)
    })
    setTimeout(() => {
        displayPlayerList()
    }, 10000);
}

bot.once('spawn', function () {
    connection();
});

function displayPlayerList() {
    const playerList = Object.keys(bot.players).map((username) => bot.players[username].username);
    const playerListString = playerList.join(' | ');
    console.log('playerList: ' + playerListString);
}

bot.once('windowOpen', function (window) {
    if (window && window.id) {
        console.log(window.containerItems());
        setTimeout(() => {
            bot.closeWindow(window);
        }, 1000);
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
        console.log("I don't understand what's in there.")
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
        // console.log(`I can get there in ${r.path.length} moves. Computation took ${r.time.toFixed(2)} ms (${nodesPerTick} nodes/tick). ${r.status}`)
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

    if (username === `${config['bot-setup']['owner']}`) {
        const mcData = require('minecraft-data')(bot.version)
        const args = message.split(' ')
        if (args[0] == 'Collect') {
            const blockType = mcData.blocksByName[args[1]]
            if (!blockType) {
                bot.chat("I don't know such a block")
                return
            }
            const block = bot.findBlock({
                matching: blockType.id,
                maxDistance: 64
            })
            if (!block) {
                bot.chat("I don't see any around here")
                return
            }
            bot.chat('Looting a short-range ' + blockType.name)
            bot.collectBlock.collect(block, err => {
                if (err) bot.chat(err.message)
            })
        }

        if (message === 'Guard') {
            const player = bot.players[username]
            if (!player) {
                bot.chat("Can't find you.")
                return
            }
            bot.chat('Got you')
            guardArea(player.entity.position)
        }

        if (message.indexOf('say ') !== -1) {
            var replacement = "say ",
                toReplace = "",
                str = message
            str = str.replace(replacement, toReplace)
            bot.chat(str)
        }
        if (message.indexOf('Follow ') !== -1) {
            var replacement = "Follow ",
                toReplace = "",
                str = message
            str = str.replace(replacement, toReplace)
            const player = bot.players[str]
            if (!player) {
                bot.chat("Can't find you")
                return
            }
            const goal = new GoalFollow(player.entity, 1)
            bot.pathfinder.setGoal(goal, true)
        }

        if (message.indexOf('Fight ') !== -1) {
            var replacement = "Fight ",
                toReplace = "",
                str = message
            str = str.replace(replacement, toReplace)
            const player = bot.players[str]
            if (!player) {
                bot.chat("Can't find him")
                return
            }
            bot.chat('Roger that')
            bot.pvp.attack(player.entity)
        }
        if (message === 'stop') {
            bot.chat('ok')
            stopGuarding()
        }
        if (message === 'Drop') {
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

if (config.utils['auto-reconnect']) {
    bot.on('end', () => {
        setTimeout(() => {
            createBot();
        }, config.utils['auto-reconnect-delay']);
    });
}

const net = require('net');

const server = net.createServer((socket) => {
    socket.setEncoding('utf-8');

    socket.on('data', (data) => {
        let chunk;
        while ((chunk = socket.read()) !== null) {
            const messages = chunk.trim().split('\n');
            for (const message of messages) {
                if (message.trim() === 'playerList') {
                    displayPlayerList();
                } else if (message.trim() === 'connect') {
                    connection();
                } else if (message.trim() !== '') {
                    bot.chat(`${message.trim()}`);
                }
            }
        }
        const stroka = data.toString().trim();
        if (stroka === 'playerList') {
            displayPlayerList()
            const playerList = Object.keys(bot.players).map((username) => bot.players[username].username);
            const playerListString = 'playerList: ' + playerList.join(' | ');
            sendToPython(socket, playerListString)
        } else if (stroka === 'connect') {
            connection();
        } else if (stroka !== '') {
            bot.chat(`${stroka}`);
        }
    });
});

const PORT = 3010;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

function sendToPython(client, message) {
    try {
        client.write(`${message}\n`);
    } catch (error) {
        console.error('Error sending message to Python client:' + error)
    }
};

const serverSocket = net.createServer((client) => {
    client.setEncoding('utf-8');

    console.log('Python client connected');
    client.on('end', () => {
        console.log('Python client disconnected');
    });

    bot.on('message', (message) => {
        const formattedMessage = message.toString();
        sendToPython(client, formattedMessage);
    });
});


serverSocket.listen(3011, () => {
    console.log('Server socket listening on port 3011');
});