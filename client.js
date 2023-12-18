const net = require('net');
const readline = require('readline');
const chalk = require('chalk')
const client = new net.Socket();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

client.connect(3010, '127.0.0.1', () => {
    console.log(chalk.green('Connected to server'));
    readInput();
});

function readInput() {
    rl.question('> ', (data) => {
        client.write(`${data.trim()}\n`);
        readInput();
    });
}

client.on('data', (data) => {
    console.log(`Server says: ${data}`);
});

client.on('close', () => {
    console.log(chalk.red('Connection closed'));
});