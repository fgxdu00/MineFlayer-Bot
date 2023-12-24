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

const server = net.createServer((socket) => {
    console.log('Client connected');

    socket.on('data', (data) => {
        const command = data.toString().trim();
        console.log(`Received command from Python: ${command}`);

        // Execute the command (you may want to add security checks here)
        const exec = require('child_process').exec;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error.message}`);
                return;
            }
            console.log(`Command output:\n${stdout}`);
        });
    });
});

const PORT = 3015;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});