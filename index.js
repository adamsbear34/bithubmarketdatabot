require('dotenv').config();
const { Telegraf } = require('telegraf');
const axios = require('axios');
const CoinGeko = require('coingecko-api');
const cron = require('node-cron');

const CoinGekoClient = new CoinGeko();

const bot = new Telegraf(process.env.BOT_TOKEN);




cron.schedule('0 8 * * *', () => {
    run();
},{scheduled: false, timezone: 'Europe/Moscow'});

const run = async() => {

    let coins = await GetTopCryptoMarketData();
   
    post = FormatMarketData(coins);
    
    sendMessage(post);

};

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });


const FormatMarketData = (data) => {

    let post = ``;
    

    data.map(coin => {

        sapces = getLine(coin.name, coin.current_price.toFixed(2), 25);
        post += `
<pre><b>${coin.name}</b>${sapces}${formatter.format(coin.current_price.toFixed(2))}</pre>  ${((coin.price_change_percentage_24h.toFixed(2) > 0) ? '🟢' : '🔴')}`;
});

    return post;
};




const getLine = (txt, num, max) => {
    var spacesNum = (max - (num.toString().length + txt.length));
    var spaces = '';

    if (num > 1000){
        spacesNum -=1;
    }else if(num > 100000){
        spacesNum -=2;
    }

    while(spacesNum > 0){
        spaces += ' ';
        spacesNum--;
    }
    return spaces;
};




const sendMessage = (msg) => {
  
    try{
       // bot.telegram.sendMessage(`${process.env.CHAT_ID}`, msg, {parse_mode: 'HTML', disable_web_page_preview: true});
        bot.telegram.sendPhoto(`${process.env.CHAT_ID}`, {source: './img/price_cover.png',}, {caption: msg, parse_mode: 'HTML'} );
    }catch(err){
        console.log(err + ` ${msg}`);
    }
    
};



const GetTopCryptoMarketData = async () => {

    let coins;

    try{
        const data = await CoinGekoClient.coins.markets({vs_currency: 'usd'});

        coins = data['data'].slice(0, 5);
    }catch(err){
        console.log(err);
    }

    return coins;
};







