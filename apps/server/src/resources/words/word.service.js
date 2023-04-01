const wordRepo = require('./word.db.repository');

const getAll = conditions => wordRepo.getAll(conditions);

const get = wordId => wordRepo.get(wordId);

module.exports = { getAll, get };
