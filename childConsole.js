console.log('Child Console is running. Waiting for messages from the main process:');

// Обрабатываем сообщения из основного процесса
process.on('message', (message) => {
    console.log(`Received in child console: ${message}`);
});

// Отправляем сообщение о готовности дочернего процесса
process.send('Child process is ready');