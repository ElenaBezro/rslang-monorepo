const io = require('socket.io-client');
const { PORT } = require('./common/config');
const socketClient = io.connect(`http://localhost:${PORT}`);

socketClient.on('connect', () => {
  socketClient.emit('npmStop');
  setTimeout(() => {
    socketClient.disconnect();
  }, 1000);
});

socketClient.on('disconnect', () => {
  process.exit(0);
});

setTimeout(() => {
  socketClient.disconnect();
}, 5000);
