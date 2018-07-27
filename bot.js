const config = {
	node_env: process.env.NODE_ENV,
	// metrika_token: process.env.METRIKA_TOKEN || '',
	host: process.env.HOST || 'http://127.0.0.1',
	port: process.env.PORT || 3000,
	token: process.env.TOKEN || '',
};

const Telegraf = require('telegraf');

const bot = new Telegraf(config.token, {
	username: 'telegram_slot'
});

const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const Scene = require('telegraf/scenes/base');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const {
	enter
} = Stage;
const stage = new Stage();

// const path = require('path'); //for path.join
// const botan = require('botanio')(config.metrika_token); //for metrika

const menuButtons = {
	game: 'Игра',
	account: 'Аккаунт'
};

const accountButtons = {
	getBalance: 'Текущий баланс',
	topUpBalance: 'Пополнить баланс',
}

const controlButtons = {
	back: 'Назад',
	menu: 'В меню',
};

const gameShortName = 'explode'

const gameMarkup = Extra.markup(
	Markup.inlineKeyboard([
		Markup.gameButton('🎮 Play now!'),
		Markup.urlButton('Website', `${config.host}:${config.port}`)
	])
)

/* Menu scene */

const menuScene = new Scene('menu');
menuScene.enter(ctx => {
	return ctx.reply('Выберите нужный пункт меню', Extra.markup(markup => markup.resize()
		.keyboard(Object.keys(menuButtons).map(key => [menuButtons[key]]))));
});
menuScene.hears(menuButtons.account, enter('account'));
menuScene.hears(menuButtons.game, ctx => ctx.replyWithGame(gameShortName, gameMarkup));
menuScene.gameQuery(ctx => {
	let gameName = ctx.callbackQuery.game_short_name;
	return ctx.answerGameQuery(`${config.host}:${config.port}/games/${gameName}/main.html`)
});
stage.register(menuScene);

/* Account scene */

const accountScene = new Scene('account');
accountScene.enter(ctx => {
	// let buttons = Object.keys(accountButtons).push(controlButtons.menu)
	return ctx.reply('Выберите нужный пункт меню', Extra.markup(markup => markup.resize()
		.keyboard(Object.keys(accountButtons).map(key => [accountButtons[key]]))));
});
accountScene.hears(controlButtons.menu, enter('menu'))
stage.register(accountScene);

/* Main listeners */

bot.use(session());
bot.use(stage.middleware());

bot.command('start', ctx => ctx.scene.enter('menu'));
bot.command('menu', ctx => ctx.scene.enter('menu'));
bot.command('help', ctx => ctx.reply('Навигация в боте производится с помощью меню.'));
bot.hears(menuButtons.game, ctx => ctx.replyWithGame(gameShortName, gameMarkup));
bot.gameQuery(ctx => {
	let gameName = ctx.callbackQuery.game_short_name;
	return ctx.answerGameQuery(`${config.host}:${config.port}/games/${gameName}/main.html`)
});
bot.on('message', enter('menu'));

module.exports = bot;

/* Helpers */
