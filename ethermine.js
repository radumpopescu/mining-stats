const { makeRequest } = require("./functions");

function processLongEthNumber(n) {
  return Math.round(n / 100000000000) / 10000000;
}

async function getEthermineBalance(address) {
  const response = await makeRequest({
    url: `https://api.ethermine.org/miner/${address}/dashboard`,
  });
  const { data } = response.data;

  if (data) {
    return processLongEthNumber(data.currentStatistics.unpaid);
  }
  return 0;
}

async function getEthermineEstimate(address) {
  const response = await makeRequest({
    url: `https://api.ethermine.org/miner/${address}/dashboard/payouts`,
  });
  const { data } = response.data;

  if (data) {
    return {
      ethPerMin: data.estimates.coinsPerMin,
      usdPerMin: data.estimates.usdPerMin,
    };
  }
  return {};
}

module.exports = { getEthermineBalance, getEthermineEstimate };
