
const TelegramBot = require('node-telegram-bot-api');

const token = '602117723:AAEMdWXTuufeSfrdBlSBM13qTfXq9YfDxeI'
const bot = new TelegramBot(token, { polling: true })



bot.onText(/\/start/, function(msg, match) {

    var keyboard = {
        reply_markup: JSON.stringify({
            keyboard: [
                ['Добавить проблему'],
                ['Существующие проблемы']
            ]
        })
    }

    bot.sendMessage(msg.chat.id, null, keyboard)
})


'use strict';

const Telegram = require('telegram-node-bot'),
    PersistentMemoryStorage = require('./adapters/PersistentMemoryStorage'),
    storage = new PersistentMemoryStorage(
        `${__dirname}/data/userStorage.json`,
        `${__dirname}/data/chatStorage.json`
    ),
    tg = new Telegram.Telegram('602117723:AAEMdWXTuufeSfrdBlSBM13qTfXq9YfDxeI', {
        workers: 1,
        storage: storage
    });

const TodoController = require('./controllers/todo')
    , OtherwiseController = require('./controllers/otherwise');

const todoCtrl = new TodoController();



tg.router.when(new Telegram.TextCommand('/add', 'addCommand'), todoCtrl)
    .when(new Telegram.TextCommand('Существующие проблемы', 'getCommand'), todoCtrl)
    .when(new Telegram.TextCommand('/delete', 'deleteCommand'), todoCtrl)
    .otherwise(new OtherwiseController());

function exitHandler(exitCode) {
    storage.flush();
    process.exit(exitCode);
}

process.on('SIGINT', exitHandler.bind(null, 0));
process.on('uncaughtException', exitHandler.bind(null, 1));
