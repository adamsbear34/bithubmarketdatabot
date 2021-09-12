require('dotenv').config();
const { Telegraf } = require('telegraf');
const axios = require('axios');
const CoinGeko = require('coingecko-api');
const cron = require('node-cron');

const CoinGekoClient = new CoinGeko();

const bot = new Telegraf(process.env.BOT_TOKEN);




cron.schedule('* * * * *', () => {
    run()
});

const run = async() => {

    let coins = await GetTopCryptoMarketData();
   
    post = FormatMarketData(coins);
    
    sendMessage(post);

};

const FormatMarketData = (data) => {

    let post = ``;
    

    data.map(coin => {
        post +=`
<b>${coin.name}</b>                 ${coin.current_price}$
`
});

    return post;
};



const sendMessage = (msg) => {
  
    try{
       // bot.telegram.sendMessage(`${process.env.CHAT_ID}`, msg, {parse_mode: 'HTML', disable_web_page_preview: true});
        bot.telegram.sendPhoto(`${process.env.CHAT_ID}`, {source: './img/Add_Logo.png',}, {caption: msg, parse_mode: 'HTML'} );
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







