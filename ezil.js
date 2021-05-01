const { makeRequest } = require("./functions");

async function getBalance(address) {
  const response = await makeRequest({
    url: `https://billing.ezil.me/balances/${address}`,
  });
  const { eth, zil } = response.data;

  return {
    eth,
    zil,
  };
}

async function getStats(address) {
  const response = await makeRequest({
    url: `https://stats.ezil.me/current_stats/${address}/reported`,
  });
  const {
    current_hashrate: currentHashrate,
    average_hashrate: averageHashrate,
    reported_hashrate: reportedHashrate,
  } = response.data;

  return {
    currentHashrate,
    averageHashrate,
    reportedHashrate,
  };
}

async function getRates() {
  const response = await makeRequest({
    url: `https://billing.ezil.me/rates`,
  });
  const {
    ETH: { BTC: ethBtc, USD: ethUsd },
    ZIL: { BTC: zilBtc, USD: zilUsd },
  } = response.data;

  return {
    ethBtc,
    ethUsd,
    zilBtc,
    zilUsd,
  };
}

async function getActualForecasts(address) {
  const response = await makeRequest({
    url: `https://billing.ezil.me/forecasts_with_hashrate/${address}`,
  });
  const {
    eth: { day: actualDailyEth },
    zil_eth: { day: actualDailyZil },
    eth_hashrate: actualDailyHashrate,
  } = response.data;

  return {
    actualDailyEth,
    actualDailyZil,
    actualDailyHashrate,
  };
}

async function getWinningEstimate(hashrate) {
  const response = await makeRequest({
    url: `https://calculator.ezil.me/api/ezil_calculator?hashrate=${hashrate}&scale=1`,
  });

  const {
    eth: {
      eth_without_zil: estDailyJustEth,
      zil: estDailyZil,
      eth_with_zil_in_eth: estDailyInEth,
      eth_with_zil_in_usd: estDailyUSD,
    },
  } = response.data;

  return {
    estDailyJustEth: parseFloat(estDailyJustEth),
    estDailyZil: parseFloat(estDailyZil),
    estDailyInEth: parseFloat(estDailyInEth),
    estDailyUSD: parseFloat(estDailyUSD),
  };
}

module.exports = {
  getBalance,
  getStats,
  getRates,
  getActualForecasts,
  getWinningEstimate,
};
