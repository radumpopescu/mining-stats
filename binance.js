const { makeRequest } = require("./functions");

function processLongEthNumber(n) {
  return Math.round(n / 100000000000) / 10000000;
}

async function getBinanceBalance(token) {
  const response = await makeRequest({
    url: `https://pool.binance.com/mining-api/v1/public/pool/stat?observerToken=${token}`,
  });
  const { data } = response.data;

  if (data) {
    return data.profitToday.ETH;
  }
  return 0;
}

module.exports = { getBinanceBalance };
