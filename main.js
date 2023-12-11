const axios = require('axios');
const crypto = require('crypto');

// Замените на актуальный API_KEY и API_SECRET
const API_KEY = 'ybzVXmGxbPTX7hmRrz01yYxGBrU60WVyYOAeAQb4KzhXazoXvoyaPFbPSQIGY7Yk';
const API_SECRET = 'oGVljlH656UIxbHZVsROSABwdOnAzCaqPGqkyNEH7Z11kxRAp0Gc5j36XHXihZ5C';

// Функция для формирования подписи запроса
function signRequest(queryString) {
  return crypto.createHmac('sha256', API_SECRET).update(queryString).digest('hex');
}

// Функция для получения информации о монетах
async function getAllCoinsInfo() {
  try {
    const timestamp = Date.now();
    const queryString = `timestamp=${timestamp}`;
    const signature = signRequest(queryString);
    
    const response = await axios.get('https://api.binance.com/sapi/v1/capital/config/getall', {
      params: {
        timestamp: timestamp,
        signature: signature,
      },
      headers: {
        'X-MBX-APIKEY': API_KEY,
      },
    });

    const coinsInfo = response.data;

    console.log('Информация о доступных монетах на Binance:');
    coinsInfo.forEach((coin) => {
      console.log(`Монета: ${coin.coin}`);
      console.log(`Для депозита доступно: ${coin.depositAllEnable}`);
      console.log(`Доступный баланс: ${coin.free}`);
      console.log(`Заморожено: ${coin.freeze}`);
      console.log('Доступные сети для депозита и вывода:');
      coin.networkList.forEach((network) => {
        console.log(`Сеть: ${network.network}`);
        console.log(`Для депозита доступно: ${network.depositEnable}`);
        console.log(`С комиссией за вывод: ${network.withdrawFee}`);
        console.log('--------------------------');
      });
    });
  } catch (error) {
    console.error('Ошибка при запросе к API Binance:', error.response ? error.response.data : error.message);
  }
}

// Вызываем функцию для получения информации о монетах
getAllCoinsInfo();
