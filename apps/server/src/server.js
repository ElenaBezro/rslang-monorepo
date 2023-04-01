const logger = require('./common/logging');

const defaultWords = require('../words/words.json');
const Word = require('./resources/words/word.model');

// uncaughtException is been catching by Winston
process.on('unhandledRejection', reason => {
  process.emit('uncaughtException', reason);
});

const mongoose = require('mongoose');
const { PORT, MONGO_CONNECTION_STRING } = require('./common/config');
const app = require('./app');

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
server.listen(PORT, () => {
  console.log(`HTTP server is listening on port ${PORT}`);
});

io.on('connection', socketServer => {
  socketServer.on('npmStop', () => {
    process.exit(0);
  });
});

const { getAll } = require('./resources/words/word.service');

mongoose.connect(MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const db = mongoose.connection;

db.on('error', () => logger.error('MongoDB connection error:')).once(
  'open',
  () => {
    logger.info('Successfully connect to DB');
    logger.info(`App is running on http://localhost:${PORT}`);

    loadDefaultWordsIfNeeded();
  }
);

const loadDefaultWordsIfNeeded = () => {
  getAll({ group: 0, page: 0 }).then(async words => {
    if (!words.length) {
      logger.info('No words in the dictionary, loading default words...');
      Word.deleteMany({}).then(() => {
        Word.create(
          defaultWords.map(({ _id, ...word }) => ({ ...word, id: _id.$oid }))
        )
          .then(() => {
            logger.info('Default words have been loaded');
          })
          .catch(error => {
            logger.error('Failed to load default words', error);
          });
      });
    }
  });
};
