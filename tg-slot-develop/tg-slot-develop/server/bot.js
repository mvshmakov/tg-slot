const config = {
	node_env: process.env.NODE_ENV,
	// metrika_token: process.env.METRIKA_TOKEN || '',
	host: process.env.HOST || 'http://127.0.0.1',
	port: process.env.PORT || 3000,
	token: process.env.TOKEN || '',
};

const {
	menuButtons,
	accountButtons,
	controlButtons,
	gameShortNames,
} = require('./markup-config');

const Telegraf = require('telegraf');

const bot = new Telegraf(config.token, { username: 'telegram_slot' });

const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const Scene = require('telegraf/scenes/base');
const Stage = require('telegraf/stage');
const session = require('telegraf/session');

const { enter } = Stage;
const stage = new Stage();

// const botan = require('botanio')(config.metrika_token); //for metrika

/* Menu scene */

const menuScene = new Scene('menu');
menuScene.enter(({ reply }) => reply('Выберите нужный пункт меню', Extra.markup(({ resize }) =>
	resize().keyboard(Object.keys(menuButtons)
		.map(key => [menuButtons[key]])))));
menuScene.hears(menuButtons.account, enter('account'));
menuScene.hears(menuButtons.games, enter('chooseGame'));
menuScene.hears(controlButtons.back, enter('menu'));
menuScene.hears(controlButtons.menu, enter('menu'));
menuScene.on('message', ({ reply }) => reply('Навигация в боте производится с помощью меню.'));
stage.register(menuScene);

/* Menu scene */

const chooseGameScene = new Scene('chooseGame');
chooseGameScene.enter(({ reply }) => reply('Выберите игру', Extra.markup(({ resize }) =>
	resize().keyboard(Object.keys(gameShortNames)
		.map(key => gameShortNames[key])
		.concat(controlButtons.menu)))));
Object.keys(gameShortNames).forEach(gn =>
	chooseGameScene.hears(gameShortNames[gn], ({ replyWithGame }) =>
		replyWithGame(gn, gameMarkup)));
chooseGameScene.hears(controlButtons.back, enter('menu'));
chooseGameScene.hears(controlButtons.menu, enter('menu'));
chooseGameScene.gameQuery((ctx) => {
	const gameName = ctx.callbackQuery.game_short_name;
	return ctx.answerGameQuery(`${config.host}:${config.port}/games/${gameName}/main.html`);
});
chooseGameScene.on('message', ({ reply }) => reply('Выберите необходимый пункт меню.'));
stage.register(chooseGameScene);

/* Account scene */

const accountScene = new Scene('account');
accountScene.enter(({ reply }) => reply('Выберите нужный пункт меню', Extra.markup(({ resize }) =>
	resize().keyboard(Object.keys(accountButtons)
		.map(key => accountButtons[key])
		.concat(controlButtons.menu)))));
accountScene.hears(controlButtons.back, enter('menu'));
accountScene.hears(controlButtons.menu, enter('menu'));
accountScene.on('message', ({ reply }) => reply('Выберите необходимый пункт меню.'));
stage.register(accountScene);

/* Main middleware */

bot.use(session());
bot.use(stage.middleware());

/* Out-scene listeners */

bot.command('start', enter('menu'));
bot.command('help', ({ reply }) => reply('Навигация в боте производится с помощью меню.'));
bot.hears(menuButtons.games, enter('chooseGame'));
bot.hears(menuButtons.account, enter('account'));
bot.hears(controlButtons.back, enter('menu'));
bot.hears(controlButtons.menu, enter('menu'));
bot.on('message', enter('menu'));

module.exports = bot;

/* Helpers */

const gameMarkup = Extra.markup(Markup.inlineKeyboard([
	Markup.gameButton('🎮 Play now!'),
	Markup.urlButton('Website', `${config.host}:${config.port}`),
]));
